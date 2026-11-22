import { DataSource } from 'typeorm';
import { Producto } from '../productos/producto.entity';

// DATOS DE EJEMPLO (los mismos de data/productos.ts del front).
// Solo se cargan si la tabla de productos está vacía.
export const PRODUCTOS_INICIALES: Omit<Producto, 'creadoEn' | 'actualizadoEn'>[] = [
  { referencia: 'TB-1001', nombre: 'Turboalimentador CAT 3116', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Caterpillar 3116', 'Maquinaria pesada'], precio: 2850000, stock: 6, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-1002', nombre: 'Turboalimentador HX35', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Chevrolet NPR', 'Kenworth'], precio: 2400000, stock: 2, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-1003', nombre: 'Turboalimentador GT1749V', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Renault Duster', 'Nissan Frontier'], precio: 1950000, stock: 0, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-2001', nombre: 'Cartridge HX35', marca: 'Turboman', categoria: 'cartridge', vehiculos: ['Chevrolet NPR', 'Kenworth'], precio: 780000, stock: 12, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-2002', nombre: 'Cartridge GT1749V', marca: 'Turboman', categoria: 'cartridge', vehiculos: ['Renault Duster'], precio: 690000, stock: 3, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-3001', nombre: 'Kit de reparación HX35', marca: 'Turboman', categoria: 'kit-reparacion', vehiculos: ['Chevrolet NPR'], precio: 190000, stock: 25, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-3002', nombre: 'Kit de reparación CAT 3116', marca: 'Turboman', categoria: 'kit-reparacion', vehiculos: ['Caterpillar 3116'], precio: 230000, stock: 8, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-4001', nombre: 'Conjunto rotor HX35', marca: 'Turboman', categoria: 'conjunto-rotor', vehiculos: ['Chevrolet NPR', 'Kenworth'], precio: 420000, stock: 5, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-5001', nombre: 'Actuador electrónico GT1749V', marca: 'Turboman', categoria: 'actuador-electronico', vehiculos: ['Renault Duster', 'Nissan Frontier'], precio: 860000, stock: 1, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-6001', nombre: 'Geometría variable GT1749V', marca: 'Turboman', categoria: 'geometria-variable', vehiculos: ['Renault Duster'], precio: 540000, stock: 7, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-7001', nombre: 'Caracol de admisión HX35', marca: 'Turboman', categoria: 'caracol-admision', vehiculos: ['Chevrolet NPR'], precio: 480000, stock: 4, imagen: null, oem: [], garantia: null },
  { referencia: 'TB-8001', nombre: 'Caracol de escape HX35', marca: 'Turboman', categoria: 'caracol-escape', vehiculos: ['Chevrolet NPR', 'Kenworth'], precio: 510000, stock: 0, imagen: null, oem: [], garantia: null },
];

export async function sembrar(db: DataSource) {
  const repo = db.getRepository(Producto);
  if ((await repo.count()) === 0) await repo.insert(PRODUCTOS_INICIALES);
}
