import { supabase } from "./supabase";
import { API_URL, apiNoDisponible, pedirApi } from "./api";

// Primero se envía a la API (Render), que lo guarda en Supabase.
// Si la API no está configurada o no responde, se guarda directo en Supabase.
// Nada de esto bloquea ni rompe la página.

export function registrar(tipo: string, detalle?: string) {
  const directo = () => {
    if (!supabase) return;
    supabase
      .from("eventos")
      .insert({ tipo, detalle: detalle ?? null, ruta: window.location.pathname })
      .then(({ error }) => {
        if (error) console.error("Rastreo:", error.message);
      });
  };

  if (!API_URL) return directo();
  pedirApi("/eventos", {
    method: "POST",
    keepalive: true, // se envía aunque el usuario cambie de página
    body: JSON.stringify({ tipo, detalle: detalle?.slice(0, 120) }),
  }).catch((e) => {
    if (apiNoDisponible(e)) directo();
    else console.error("Rastreo:", (e as Error).message);
  });
}

export function guardarCotizacion(datos: {
  nombre: string;
  telefono: string;
  aceptaDatos: boolean;
  items: { referencia: string; nombre: string; cantidad: number; precio: number | null }[];
  total: number;
}) {
  const directo = () => {
    if (!supabase) return;
    const { nombre, telefono, items, total } = datos; // la tabla no tiene columna aceptaDatos
    supabase
      .from("cotizaciones")
      .insert({ nombre, telefono, items, total })
      .then(({ error }) => {
        if (error) console.error("Cotización:", error.message);
      });
  };

  if (!API_URL) return directo();
  // A la API solo van referencia y cantidad: el servidor pone nombres y precios.
  pedirApi("/cotizaciones", {
    method: "POST",
    keepalive: true, // WhatsApp se abre enseguida; la petición sigue en segundo plano
    body: JSON.stringify({
      nombre: datos.nombre,
      telefono: datos.telefono.replace(/\D/g, ""),
      aceptaDatos: datos.aceptaDatos,
      items: datos.items.map((i) => ({ referencia: i.referencia, cantidad: i.cantidad })),
    }),
  }).catch((e) => {
    if (apiNoDisponible(e)) directo();
    else console.error("Cotización:", (e as Error).message);
  });
}
