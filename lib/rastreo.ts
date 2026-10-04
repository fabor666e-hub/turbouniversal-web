import { supabase } from "./supabase";

// Guarda un evento (vista, búsqueda, clic...). Si falla, no afecta la página.
export function registrar(tipo: string, detalle?: string) {
  if (!supabase) return;
  supabase
    .from("eventos")
    .insert({ tipo, detalle: detalle ?? null, ruta: window.location.pathname })
    .then(({ error }) => {
      if (error) console.error("Rastreo:", error.message);
    });
}

export function guardarCotizacion(datos: {
  nombre: string;
  telefono: string;
  items: { referencia: string; nombre: string; cantidad: number; precio: number }[];
  total: number;
}) {
  if (!supabase) return;
  supabase
    .from("cotizaciones")
    .insert(datos)
    .then(({ error }) => {
      if (error) console.error("Cotización:", error.message);
    });
}