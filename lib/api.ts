// Cliente de la API de Turbo Universal (NestJS en Render).
// Se puede usar en el servidor y en el navegador. Contrato: docs/contratos/api.md
//
// Si NEXT_PUBLIC_API_URL no está definida o la API no responde, cada función
// que la usa vuelve a Supabase directo, así la página nunca se queda sin datos.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export class ErrorApi extends Error {
  constructor(
    public estado: number, // 0 = no hubo respuesta (sin conexión, tiempo agotado, CORS)
    public codigo: string,
    mensaje: string
  ) {
    super(mensaje);
  }
}

type Opciones = RequestInit & {
  espera?: number; // milisegundos antes de rendirse
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function pedirApi<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  if (!API_URL) throw new ErrorApi(0, "SIN_API", "NEXT_PUBLIC_API_URL no está definida.");
  const { espera = 5000, headers, ...init } = opciones;

  let r: Response;
  try {
    r = await fetch(`${API_URL}${ruta}`, {
      ...init,
      // Content-Type solo cuando hay cuerpo (evita una consulta CORS extra en los GET)
      headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...headers },
      signal: init.keepalive ? undefined : AbortSignal.timeout(espera),
    });
  } catch (e) {
    if ((e as Error)?.name === "TimeoutError")
      throw new ErrorApi(0, "TIEMPO_AGOTADO", "La API tardó demasiado en responder.");
    throw new ErrorApi(0, "SIN_CONEXION", "No se pudo contactar la API.");
  }

  if (r.status === 204) return undefined as T;
  const cuerpo = await r.json().catch(() => null);
  if (!r.ok) {
    throw new ErrorApi(
      r.status,
      cuerpo?.error?.codigo ?? "ERROR",
      cuerpo?.error?.mensaje ?? `La API respondió ${r.status}.`
    );
  }
  return cuerpo as T;
}

// true cuando la API no está disponible (no es que haya rechazado los datos):
// en ese caso sí tiene sentido ir directo a Supabase.
export function apiNoDisponible(e: unknown): boolean {
  return !(e instanceof ErrorApi) || e.estado === 0 || e.estado >= 500;
}
