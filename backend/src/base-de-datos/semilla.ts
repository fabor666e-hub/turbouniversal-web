import { DataSource } from 'typeorm';
import { Producto } from '../productos/producto.entity';

// Turbos reales del catálogo de la empresa (Flipsnack "Turbo Alimentadores", nov. 2026).
// Precio y stock en null = "a consultar": el catálogo no los publica.
// Mismos datos que data/productos.ts del front. Solo se cargan si la tabla de productos está vacía.
export const PRODUCTOS_INICIALES: Omit<Producto, 'creadoEn' | 'actualizadoEn'>[] = [
  { referencia: 'JF-158', nombre: 'Turbo Land Rover Evoque K03', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Land Rover Evoque'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-027', nombre: 'Turbo NPR 3.5 modelo 1995', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Chevrolet NPR 3.5'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-093', nombre: 'Turbo LUV D-Max 2.5', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Chevrolet LUV D-Max 2.5'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-018', nombre: 'Turbo Mazda T 4.5', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Mazda T 4.5'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-153', nombre: 'Turbo Perkins 210 DTI', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Perkins 210 DTI'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-063', nombre: 'Turbo Perkins Pajarita GT2556S', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Perkins Pajarita'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-154', nombre: 'Turbo Perkins 1006T', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Perkins 1006T'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-008', nombre: 'Turbo Perkins Pajarita', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Perkins Pajarita'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-009', nombre: 'Turbo Perkins Pajarita', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Perkins Pajarita'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-011', nombre: 'Turbo Perkins Pajarita', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Perkins Pajarita'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-057', nombre: 'Turbo Toyota Super Delta CT12B', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Toyota Super Delta'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-039', nombre: 'Turbo Toyota Vigo 2.5 CT16 completo homologado', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Toyota Vigo 2.5'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-148', nombre: 'Turbo Cummins 6CT manguera HX40/H1E sin pestaña', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 6CT'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-070', nombre: 'Turbo Cummins 6BT AA', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 6BT'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-150', nombre: 'Turbo Caterpillar 3116 sin válvula', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Caterpillar 3116'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-092', nombre: 'Turbo Cummins 4BT 3.9 L HX30W', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 4BT 3.9'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-032', nombre: 'Turbo Cummins 6BT-160 HX35/H1C', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 6BT-160'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-069', nombre: 'Turbo Cummins 4BTA Case New Holland Elite', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 4BTA', 'Case New Holland'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-017', nombre: 'Turbo Cummins 6BT-180 H1C plato separado', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 6BT-180'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-059', nombre: 'Turbo Cummins 6BT-190 HX35W', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 6BT-190'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-071', nombre: 'Turbo Cummins 6BT pestaña HX35', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins 6BT'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-155', nombre: 'Turbo Cummins KTA 19', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins KTA 19'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-058', nombre: 'Turbo Cummins QSB 3.8', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins QSB 3.8'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-073', nombre: 'Turbo Cummins M11/L10-300 HX50', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Cummins M11', 'Cummins L10-300'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-078', nombre: 'Turbo Foton BJ49 2.8 L GT22', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Foton BJ49 2.8'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-157', nombre: 'Turbo Ford Escape / Focus', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Ford Escape', 'Ford Focus'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-149', nombre: 'Turbo Hitachi EX200 motor 6BD1', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Hitachi EX200', 'Isuzu 6BD1'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-061', nombre: 'Turbo Nissan Frontier NP300', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Nissan Frontier NP300'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-026', nombre: 'Turbo Isuzu NPR 3.9 modelo 1998', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Isuzu NPR 3.9'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-077', nombre: 'Turbo FTR IHI', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Chevrolet FTR'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-147', nombre: 'Turbo Hyundai H100 Grand Starex GT1749', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Hyundai H100', 'Hyundai Grand Starex'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-030', nombre: 'Turbo Isuzu NKR-NHR I, II y III', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Isuzu NKR', 'Isuzu NHR'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-151', nombre: 'Turbo JMC motor Isuzu', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['JMC Isuzu'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-049', nombre: 'Turbo John Deere TA34/TB03', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['John Deere'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-031', nombre: 'Turbo Iveco Daily GT1752S', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Iveco Daily'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'JF-156', nombre: 'Turbo Kia Sorento 2.2', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Kia Sorento 2.2'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
  { referencia: 'KOMATSU-PC300', nombre: 'Turbo Komatsu PC300', marca: 'Turboman', categoria: 'turboalimentadores', vehiculos: ['Komatsu PC300'], precio: null, stock: null, imagen: null, oem: [], garantia: null },
];

export async function sembrar(db: DataSource) {
  const repo = db.getRepository(Producto);
  if ((await repo.count()) === 0) await repo.insert(PRODUCTOS_INICIALES);
}
