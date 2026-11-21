import type { Page } from "@playwright/test";

// Abre una página y espera a que termine de llegar el HTML por partes (streaming con
// loading.tsx) y a que React la active. Sin esto, por un instante el contenido aparece
// dos veces (la copia oculta del streaming y la visible) y las pruebas fallan al azar.
export async function ir(page: Page, ruta: string) {
  const r = await page.goto(ruta, { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  return r;
}
