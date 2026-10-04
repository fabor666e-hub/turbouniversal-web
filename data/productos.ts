export type Producto = {
  referencia: string;
  nombre: string;
  marca: string;
  categoria: string; // slug de la categoría
  vehiculos: string[];
  precio: number; // en pesos colombianos
  stock: number;
  imagen?: string;
};

export const categorias = [
  { slug: "turboalimentadores", nombre: "Turboalimentadores" },
  { slug: "cartridge", nombre: "Cartridge" },
  { slug: "kit-reparacion", nombre: "Kit de reparación" },
  { slug: "conjunto-rotor", nombre: "Conjunto rotor" },
  { slug: "actuador-electronico", nombre: "Actuador electrónico" },
  { slug: "geometria-variable", nombre: "Geometría variable" },
  { slug: "caracol-admision", nombre: "Caracol de admisión" },
  { slug: "caracol-escape", nombre: "Caracol de escape" },
];

// DATOS DE EJEMPLO: reemplázalos por los productos reales de la empresa
export const productos: Producto[] = [
  { referencia: "TB-1001", nombre: "Turboalimentador CAT 3116", marca: "Turboman", categoria: "turboalimentadores", vehiculos: ["Caterpillar 3116", "Maquinaria pesada"], precio: 2850000, stock: 6 },
  { referencia: "TB-1002", nombre: "Turboalimentador HX35", marca: "Turboman", categoria: "turboalimentadores", vehiculos: ["Chevrolet NPR", "Kenworth"], precio: 2400000, stock: 2 },
  { referencia: "TB-1003", nombre: "Turboalimentador GT1749V", marca: "Turboman", categoria: "turboalimentadores", vehiculos: ["Renault Duster", "Nissan Frontier"], precio: 1950000, stock: 0 },
  { referencia: "TB-2001", nombre: "Cartridge HX35", marca: "Turboman", categoria: "cartridge", vehiculos: ["Chevrolet NPR", "Kenworth"], precio: 780000, stock: 12 },
  { referencia: "TB-2002", nombre: "Cartridge GT1749V", marca: "Turboman", categoria: "cartridge", vehiculos: ["Renault Duster"], precio: 690000, stock: 3 },
  { referencia: "TB-3001", nombre: "Kit de reparación HX35", marca: "Turboman", categoria: "kit-reparacion", vehiculos: ["Chevrolet NPR"], precio: 190000, stock: 25 },
  { referencia: "TB-3002", nombre: "Kit de reparación CAT 3116", marca: "Turboman", categoria: "kit-reparacion", vehiculos: ["Caterpillar 3116"], precio: 230000, stock: 8 },
  { referencia: "TB-4001", nombre: "Conjunto rotor HX35", marca: "Turboman", categoria: "conjunto-rotor", vehiculos: ["Chevrolet NPR", "Kenworth"], precio: 420000, stock: 5 },
  { referencia: "TB-5001", nombre: "Actuador electrónico GT1749V", marca: "Turboman", categoria: "actuador-electronico", vehiculos: ["Renault Duster", "Nissan Frontier"], precio: 860000, stock: 1 },
  { referencia: "TB-6001", nombre: "Geometría variable GT1749V", marca: "Turboman", categoria: "geometria-variable", vehiculos: ["Renault Duster"], precio: 540000, stock: 7 },
  { referencia: "TB-7001", nombre: "Caracol de admisión HX35", marca: "Turboman", categoria: "caracol-admision", vehiculos: ["Chevrolet NPR"], precio: 480000, stock: 4 },
  { referencia: "TB-8001", nombre: "Caracol de escape HX35", marca: "Turboman", categoria: "caracol-escape", vehiculos: ["Chevrolet NPR", "Kenworth"], precio: 510000, stock: 0 },
];