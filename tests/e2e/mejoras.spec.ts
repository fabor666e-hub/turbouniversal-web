// Mejoras de nov. 2026: política de datos (F2), SEO y compartir (F1), exportar CSV (F4).
import { expect, test } from "@playwright/test";
import { ir } from "./ir";

const CLAVE = "clave-de-prueba";

test("la casilla de la cotización enlaza a la política de datos", async ({ page, context }) => {
  await ir(page, "/productos");
  await page.locator('div[data-ref="TB-2001"]:visible').getByRole("button").click();
  const nueva = context.waitForEvent("page");
  await page.locator("aside").getByRole("link", { name: "Ver política de datos" }).click();
  const politica = await nueva;
  await expect(politica).toHaveURL(/\/privacidad$/);
  await expect(politica.getByRole("heading", { level: 1 })).toHaveText("Política de tratamiento de datos");
  await expect(politica.getByText("10 días hábiles")).toBeVisible();
});

test("el pie de página enlaza a la política de datos", async ({ page }) => {
  await ir(page, "/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Política de tratamiento de datos" }).click();
  await expect(page).toHaveURL(/\/privacidad$/);
});

test("sitemap.xml lista las páginas públicas y cada producto", async ({ request }) => {
  const r = await request.get("/sitemap.xml");
  expect(r.ok()).toBe(true);
  const xml = await r.text();
  expect(xml).toContain("https://turbouniversal-web.vercel.app/productos/TB-1001");
  expect(xml).toContain("https://turbouniversal-web.vercel.app/privacidad");
  expect(xml).not.toContain("/panel");
});

test("robots.txt bloquea el panel y apunta al sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Disallow: /panel");
  expect(txt).toContain("Sitemap: https://turbouniversal-web.vercel.app/sitemap.xml");
});

test("la página del producto tiene datos estructurados, canónica y botón de compartir", async ({ page }) => {
  await ir(page, "/productos/TB-1002");
  const json = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() ?? "{}");
  expect(json).toMatchObject({ "@type": "Product", sku: "TB-1002", offers: { price: 2400000, priceCurrency: "COP" } });
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://turbouniversal-web.vercel.app/productos/TB-1002");
  const compartir = page.getByRole("link", { name: "Compartir este producto" });
  const href = (await compartir.getAttribute("href")) ?? "";
  expect(href.startsWith("https://wa.me/?text=")).toBe(true);
  expect(decodeURIComponent(href)).toContain("/productos/TB-1002");
});

test("acceso cruzado: sin sesión /panel/exportar responde 401", async ({ request }) => {
  const r = await request.get("/panel/exportar");
  expect(r.status()).toBe(401);
});

test("una cookie falsa tampoco descarga las cotizaciones", async ({ request }) => {
  const r = await request.get("/panel/exportar", { headers: { cookie: "panel=adivinando" } });
  expect(r.status()).toBe(401);
});

test("con la clave correcta, exportar ya no responde 401", async ({ request }) => {
  const r = await request.get("/panel/exportar", { headers: { cookie: `panel=${CLAVE}` } });
  // Sin Supabase ni API en las pruebas no hay de dónde leer: 503, pero nunca 401.
  expect([200, 503]).toContain(r.status());
});
