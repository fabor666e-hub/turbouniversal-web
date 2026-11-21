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
      (!q || normalizar([p.referencia, p.nombre, p.marca, ...p.vehiculos].join(" ")).includes(q))
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
