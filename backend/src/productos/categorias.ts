// Las 8 líneas de producto (mismas del front: data/productos.ts)
export const CATEGORIAS = [
  { slug: 'turboalimentadores', nombre: 'Turboalimentadores' },
  { slug: 'cartridge', nombre: 'Cartridge' },
  { slug: 'kit-reparacion', nombre: 'Kit de reparación' },
  { slug: 'conjunto-rotor', nombre: 'Conjunto rotor' },
  { slug: 'actuador-electronico', nombre: 'Actuador electrónico' },
  { slug: 'geometria-variable', nombre: 'Geometría variable' },
  { slug: 'caracol-admision', nombre: 'Caracol de admisión' },
  { slug: 'caracol-escape', nombre: 'Caracol de escape' },
] as const;

export const SLUGS_CATEGORIA = CATEGORIAS.map((c) => c.slug);
