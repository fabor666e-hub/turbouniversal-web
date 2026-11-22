// Reglas de negocio del front, sin React, para poder probarlas (tests/unit).
// Los componentes usan estas funciones; si una regla cambia, se cambia aquí.
import type { Producto } from "@/data/productos";
import { normalizar } from "./utils";

// ── F1 · Catálogo y buscador ────────────────────────────────────────────────

// Busca en referencia, nombre, marca y vehículos, sin importar mayúsculas ni tildes.
export function buscarProductos(productos: Producto[], busqueda: string, categoria = ""): Producto[] {
  const q = normalizar(busqueda.trim());
  return productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!q ||
        normalizar([p.referencia, p.nombre, p.marca, ...p.vehiculos, ...(p.oem ?? [])].join(" ")).includes(q))
  );
}

export type EstadoStock = "agotado" | "pocas" | "disponible";

// 0 = Agotado · 1 a 3 = Pocas unidades · 4 o más = Disponible
export function estadoStock(stock: number): EstadoStock {
  if (stock <= 0) return "agotado";
  if (stock <= 3) return "pocas";
  return "disponible";
}

// ── F2 · Cotización ─────────────────────────────────────────────────────────

export type Item = { p: Producto; cantidad: number };

// REGLA CRÍTICA (front): nunca se cotiza más que el stock disponible.
export function agregarItem(items: Item[], p: Producto): Item[] {
  if (p.stock <= 0) return items;
  const existe = items.find((i) => i.p.referencia === p.referencia);
  if (existe) {
    return items.map((i) =>
      i.p.referencia === p.referencia ? { ...i, cantidad: Math.min(i.cantidad + 1, p.stock) } : i
    );
  }
  return [...items, { p, cantidad: 1 }];
}

// Suma o resta unidades; con 0 unidades el producto sale de la lista.
export function cambiarCantidad(items: Item[], referencia: string, delta: number): Item[] {
  return items
    .map((i) =>
      i.p.referencia === referencia ? { ...i, cantidad: Math.min(i.cantidad + delta, i.p.stock) } : i
    )
    .filter((i) => i.cantidad > 0);
}

export const totalUnidades = (items: Item[]) => items.reduce((s, i) => s + i.cantidad, 0);
export const totalPrecio = (items: Item[]) => items.reduce((s, i) => s + i.cantidad * i.p.precio, 0);

// Nombre de 2+ letras, teléfono de 7 a 15 dígitos y autorización de datos (Ley 1581).
export function cotizacionLista(nombre: string, telefono: string, aceptaDatos: boolean): boolean {
  const digitos = telefono.replace(/\D/g, "").length;
  return nombre.trim().length > 1 && digitos >= 7 && digitos <= 15 && aceptaDatos;
}

export function mensajeWhatsApp(items: Item[], nombre: string, telefono: string): string {
  return [
    "Hola, quiero cotizar los siguientes productos:",
    "",
    ...items.map((i) => `• ${i.cantidad} x ${i.p.nombre} (Ref. ${i.p.referencia})`),
    "",
    `Nombre: ${nombre}`,
    `Teléfono: ${telefono}`,
  ].join("\n");
}

// ── F3 · Asistente por vehículo ─────────────────────────────────────────────

// "Chevrolet NPR" -> marca "Chevrolet", modelo "NPR"
export function partirVehiculo(v: string) {
  const [marca, ...resto] = v.trim().split(" ");
  return { marca, modelo: resto.join(" ") || "Todos los modelos" };
}

export function marcasDeVehiculos(productos: Producto[]): string[] {
  const s = new Set<string>();
  productos.forEach((p) => p.vehiculos.forEach((v) => s.add(partirVehiculo(v).marca)));
  return [...s].sort();
}

export function modelosDeMarca(productos: Producto[], marca: string): string[] {
  const s = new Set<string>();
  productos.forEach((p) =>
    p.vehiculos.forEach((v) => {
      const x = partirVehiculo(v);
      if (x.marca === marca) s.add(x.modelo);
    })
  );
  return [...s].sort();
}

export function compatiblesCon(productos: Producto[], marca: string, modelo: string): Producto[] {
  return productos.filter((p) =>
    p.vehiculos.some((v) => {
      const x = partirVehiculo(v);
      return x.marca === marca && x.modelo === modelo;
    })
  );
}

// ── SEO y compartir (F1) ────────────────────────────────────────────────────

// Mensaje para compartir un producto por WhatsApp con cualquier contacto.
export function mensajeCompartir(p: Producto, url: string): string {
  return `Mira este repuesto en Turbo Universal: ${p.nombre} (Ref. ${p.referencia}), compatible con ${p.vehiculos.join(", ")}. ${url}`;
}

const DISPONIBILIDAD: Record<EstadoStock, string> = {
  agotado: "https://schema.org/OutOfStock",
  pocas: "https://schema.org/LimitedAvailability",
  disponible: "https://schema.org/InStock",
};

// Datos estructurados (schema.org/Product) para que Google muestre precio y disponibilidad.
export function datosEstructurados(p: Producto, url: string, imagen?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    sku: p.referencia,
    mpn: p.oem?.[0] ?? p.referencia,
    ...(imagen ? { image: imagen } : {}),
    brand: { "@type": "Brand", name: p.marca },
    description: `${p.nombre}, referencia ${p.referencia}. Compatible con ${p.vehiculos.join(", ")}.`,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "COP",
      price: p.precio,
      availability: DISPONIBILIDAD[estadoStock(p.stock)],
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Importadora Turbo Universal" },
    },
  };
}

// ── F4 · Panel: exportar cotizaciones ───────────────────────────────────────

type FilaCotizacion = {
  id: number;
  nombre: string;
  telefono: string;
  items: { referencia: string; nombre: string; cantidad: number; precio: number }[];
  total: number;
  creadoEn: string;
};

// Una celda CSV segura: comillas dobles escapadas y sin fórmulas (evita inyección en Excel).
function celda(valor: string | number): string {
  let t = String(valor);
  if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
  return `"${t.replace(/"/g, '""')}"`;
}

// CSV con separador ";" (Excel en español lo abre en columnas) y una fila por producto cotizado.
export function cotizacionesACsv(cotizaciones: FilaCotizacion[]): string {
  const encabezado = ["Cotización", "Fecha", "Cliente", "Teléfono", "Referencia", "Producto", "Cantidad", "Precio unitario", "Subtotal", "Total cotización"];
  const filas = cotizaciones.flatMap((c) =>
    c.items.map((i) => [
      c.id,
      new Date(c.creadoEn).toLocaleString("es-CO", { timeZone: "America/Bogota" }),
      c.nombre,
      c.telefono,
      i.referencia,
      i.nombre,
      i.cantidad,
      i.precio,
      i.cantidad * i.precio,
      c.total,
    ])
  );
  return "﻿" + [encabezado, ...filas].map((f) => f.map(celda).join(";")).join("\r\n");
}
