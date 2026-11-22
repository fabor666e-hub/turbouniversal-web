// "Geometría" -> "geometria": quita mayúsculas y tildes para buscar
export const normalizar = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// Marcas de vehículo o motor de más de una palabra (el resto se parte en la primera palabra).
// Mismo listado que lib/reglas.ts del front.
export const MARCAS_COMPUESTAS = ['Case New Holland', 'New Holland', 'John Deere', 'Land Rover', 'Mercedes Benz'];

// "Chevrolet NPR" -> { marca: "Chevrolet", modelo: "NPR" }; "Land Rover Evoque" -> { "Land Rover", "Evoque" }
export function partirVehiculo(v: string): { marca: string; modelo: string } {
  const limpio = v.trim().replace(/\s+/g, ' ');
  const compuesta = MARCAS_COMPUESTAS.find((m) => limpio.toLowerCase().startsWith(m.toLowerCase() + ' ') || limpio.toLowerCase() === m.toLowerCase());
  const marca = compuesta ?? limpio.split(' ')[0];
  const modelo = limpio.slice(marca.length).trim();
  return { marca, modelo: modelo || 'Todos los modelos' };
}
