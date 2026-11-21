// Pruebas unitarias de las reglas de negocio del front (lib/reglas.ts).
// Cada bloque corresponde a una spec: docs/specs/F1, F2 y F3.
import { expect, test } from "@playwright/test";
import { productos } from "@/data/productos";
import {
  agregarItem,
  buscarProductos,
  cambiarCantidad,
  compatiblesCon,
  cotizacionLista,
  estadoStock,
  marcasDeVehiculos,
  mensajeWhatsApp,
  modelosDeMarca,
  partirVehiculo,
  totalPrecio,
  totalUnidades,
  type Item,
} from "@/lib/reglas";

const ref = (r: string) => productos.find((p) => p.referencia === r)!;
const refs = (lista: { referencia: string }[]) => lista.map((p) => p.referencia);

test.describe("F1 · Catálogo y buscador", () => {
  test('"npr" devuelve solo productos que mencionan NPR', () => {
    const r = buscarProductos(productos, "npr");
    expect(r.length).toBeGreaterThan(0);
    for (const p of r) expect(p.vehiculos.join(" ")).toMatch(/NPR/);
  });

  test('"geometria" sin tilde encuentra "Geometría variable"', () => {
    expect(refs(buscarProductos(productos, "geometria"))).toEqual(["TB-6001"]);
  });

  test("ignora mayúsculas y espacios y busca por referencia", () => {
    expect(refs(buscarProductos(productos, "  tb-1002 "))).toEqual(["TB-1002"]);
  });

  test("filtra por categoría y combina con el texto", () => {
    const cartridges = buscarProductos(productos, "", "cartridge");
    expect(cartridges.every((p) => p.categoria === "cartridge")).toBe(true);
    expect(refs(buscarProductos(productos, "duster", "cartridge"))).toEqual(["TB-2002"]);
  });

  test("una búsqueda sin coincidencias devuelve una lista vacía", () => {
    expect(buscarProductos(productos, "ferrari")).toEqual([]);
  });

  test("estado de stock: 0 agotado, 1–3 pocas, 4+ disponible", () => {
    expect(estadoStock(0)).toBe("agotado");
    expect(estadoStock(1)).toBe("pocas");
    expect(estadoStock(3)).toBe("pocas");
    expect(estadoStock(4)).toBe("disponible");
  });
});

test.describe("F2 · Cotización — regla crítica: nunca más que el stock", () => {
  test("agregar un producto agotado no lo agrega", () => {
    expect(agregarItem([], ref("TB-1003"))).toEqual([]);
  });

  test("agregar varias veces no supera el stock (TB-1002 tiene 2)", () => {
    let items: Item[] = [];
    for (let i = 0; i < 5; i++) items = agregarItem(items, ref("TB-1002"));
    expect(items).toHaveLength(1);
    expect(items[0].cantidad).toBe(2);
  });

  test('"+" se detiene en el stock y "−" en 1 unidad saca el producto', () => {
    let items = agregarItem([], ref("TB-5001")); // stock 1
    items = cambiarCantidad(items, "TB-5001", 1);
    expect(items[0].cantidad).toBe(1);
    items = cambiarCantidad(items, "TB-5001", -1);
    expect(items).toEqual([]);
  });

  test("los totales suman cantidades y precio × cantidad", () => {
    let items = agregarItem([], ref("TB-2001")); // 780.000
    items = cambiarCantidad(items, "TB-2001", 1);
    items = agregarItem(items, ref("TB-3001")); // 190.000
    expect(totalUnidades(items)).toBe(3);
    expect(totalPrecio(items)).toBe(780000 * 2 + 190000);
  });

  test("solo se puede enviar con nombre, teléfono válido y autorización de datos", () => {
    expect(cotizacionLista("Ana", "310 308 0416", true)).toBe(true);
    expect(cotizacionLista("A", "3103080416", true)).toBe(false); // nombre muy corto
    expect(cotizacionLista("Ana", "310-30", true)).toBe(false); // menos de 7 dígitos
    expect(cotizacionLista("Ana", "1234567890123456", true)).toBe(false); // más de 15
    expect(cotizacionLista("Ana", "3103080416", false)).toBe(false); // sin Ley 1581
  });

  test("el mensaje de WhatsApp lleva cantidad, nombre, referencia, cliente y teléfono", () => {
    const items = agregarItem([], ref("TB-1001"));
    const m = mensajeWhatsApp(items, "José", "3103080416");
    expect(m).toContain("• 1 x Turboalimentador CAT 3116 (Ref. TB-1001)");
    expect(m).toContain("Nombre: José");
    expect(m).toContain("Teléfono: 3103080416");
  });
});

test.describe("F3 · Asistente por vehículo", () => {
  test('"Chevrolet NPR" se parte en marca y modelo; sin modelo es "Todos los modelos"', () => {
    expect(partirVehiculo("Chevrolet NPR")).toEqual({ marca: "Chevrolet", modelo: "NPR" });
    expect(partirVehiculo("Kenworth")).toEqual({ marca: "Kenworth", modelo: "Todos los modelos" });
  });

  test("las marcas salen de los vehículos, sin repetir y en orden", () => {
    const marcas = marcasDeVehiculos(productos);
    expect(marcas).toContain("Chevrolet");
    expect(marcas).toContain("Renault");
    expect(new Set(marcas).size).toBe(marcas.length);
    expect([...marcas].sort()).toEqual(marcas);
  });

  test("los modelos de Renault son solo Duster", () => {
    expect(modelosDeMarca(productos, "Renault")).toEqual(["Duster"]);
  });

  test("Chevrolet → NPR devuelve solo productos compatibles con Chevrolet NPR", () => {
    const r = compatiblesCon(productos, "Chevrolet", "NPR");
    expect(refs(r)).toEqual(["TB-1002", "TB-2001", "TB-3001", "TB-4001", "TB-7001", "TB-8001"]);
    for (const p of r) expect(p.vehiculos).toContain("Chevrolet NPR");
  });

  test("un vehículo que no existe no devuelve productos", () => {
    expect(compatiblesCon(productos, "Ferrari", "F40")).toEqual([]);
  });
});
