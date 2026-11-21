// "Geometría" -> "geometria": quita mayúsculas y tildes para buscar
export const normalizar = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
