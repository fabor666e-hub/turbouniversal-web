import { cookies } from "next/headers";

// SOLO servidor. Devuelve true si quien hace la petición inició sesión en /panel.
export async function sesionValida(): Promise<boolean> {
  const valor = (await cookies()).get("panel")?.value;
  const clave = process.env.PANEL_CLAVE;
  return !!clave && valor === clave;
}
