import { sesionValida } from "@/lib/sesionPanel";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hayApi, pedirAdmin } from "@/lib/apiAdmin";
import { cotizacionesACsv } from "@/lib/reglas";

// GET /panel/exportar → descarga las últimas 100 cotizaciones en CSV (se abre en Excel).
// Solo con la sesión del panel: sin la cookie correcta responde 401 (acceso cruzado).
export const dynamic = "force-dynamic";

type Cotizacion = Parameters<typeof cotizacionesACsv>[0][number];

async function leerCotizaciones(): Promise<Cotizacion[] | null> {
  if (hayApi()) {
    try {
      return await pedirAdmin<Cotizacion[]>("/cotizaciones?limite=100", { espera: 15_000 });
    } catch (e) {
      console.warn("Exportar: API no disponible, leyendo Supabase:", (e as Error).message);
    }
  }
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("cotizaciones")
    .select("id, nombre, telefono, items, total, creado_en")
    .order("creado_en", { ascending: false })
    .limit(100);
  if (error) return null;
  return (data ?? []).map(({ creado_en, ...c }) => ({ ...c, creadoEn: creado_en }) as Cotizacion);
}

export async function GET() {
  if (!(await sesionValida())) {
    return new Response("No autorizado", { status: 401 });
  }
  const cotizaciones = await leerCotizaciones();
  if (!cotizaciones) {
    return new Response("No se pudieron leer las cotizaciones.", { status: 503 });
  }
  const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  return new Response(cotizacionesACsv(cotizaciones), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cotizaciones-${fecha}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
