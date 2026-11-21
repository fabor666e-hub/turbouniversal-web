// SOLO servidor (acciones y páginas del panel). Nunca lo importes en un componente "use client".
// Inicia sesión en la API con PANEL_CLAVE y guarda el token (8 h) en memoria del servidor.
import { API_URL, ErrorApi, pedirApi } from "./api";

let sesion: { token: string; vence: number } | null = null;
let iniciando: Promise<string> | null = null; // evita dos logins a la vez

function token(espera: number): Promise<string> {
  if (sesion && sesion.vence - Date.now() > 60_000) return Promise.resolve(sesion.token);
  iniciando ??= iniciarSesion(espera).finally(() => (iniciando = null));
  return iniciando;
}

async function iniciarSesion(espera: number): Promise<string> {
  const clave = process.env.PANEL_CLAVE;
  if (!clave) throw new ErrorApi(0, "SIN_CLAVE", "Falta PANEL_CLAVE.");
  const r = await pedirApi<{ token: string; expiraEn: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ clave }),
    espera,
    cache: "no-store",
  });
  sesion = { token: r.token, vence: Date.parse(r.expiraEn) };
  return r.token;
}

export const hayApi = () => !!API_URL;

// Llama una ruta 🔒 de la API. Si el token venció, inicia sesión otra vez una sola vez.
export async function pedirAdmin<T>(
  ruta: string,
  init: RequestInit & { espera?: number } = {}
): Promise<T> {
  const espera = init.espera ?? 20_000;
  for (let intento = 0; intento < 2; intento++) {
    const t = await token(espera);
    try {
      return await pedirApi<T>(ruta, {
        ...init,
        espera,
        cache: "no-store",
        headers: { ...init.headers, Authorization: `Bearer ${t}` },
      });
    } catch (e) {
      if (e instanceof ErrorApi && e.estado === 401 && intento === 0) {
        sesion = null;
        continue;
      }
      throw e;
    }
  }
  throw new ErrorApi(401, "NO_AUTORIZADO", "La API rechazó la clave del panel.");
}
