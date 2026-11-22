// F2 · Cotización por WhatsApp (docs/specs/F2-cotizacion.md)
// Regla crítica en la interfaz: nunca se cotiza más que el stock disponible.
import { expect, test, type Page } from "@playwright/test";
import { ir } from "./ir";

// En las pruebas no se abre WhatsApp de verdad: se guarda la URL que se intentó abrir.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { abiertas: string[] }).abiertas = [];
    window.open = ((url: string) => {
      (window as unknown as { abiertas: string[] }).abiertas.push(String(url));
      return {} as Window;
    }) as typeof window.open;
  });
});

const panel = (page: Page) => page.locator("aside");
const enPanel = (page: Page, ref: string) => panel(page).locator(`[data-ref="${ref}"]`);
const botonEnviar = (page: Page) => page.getByRole("button", { name: "Enviar cotización por WhatsApp" });

async function agregar(page: Page, ref: string) {
  await page.locator(`div[data-ref="${ref}"]:visible`).getByRole("button").click();
}

test("agregar abre el panel y el contador sube", async ({ page }) => {
  await ir(page, "/productos");
  await agregar(page, "TB-2001");
  await expect(enPanel(page, "TB-2001")).toBeVisible();
  await expect(page.getByRole("button", { name: /Mi cotización/ }).first()).toContainText("1");
});

test('regla crítica: "+" se bloquea al llegar al stock (TB-1002 tiene 2)', async ({ page }) => {
  await ir(page, "/productos");
  await agregar(page, "TB-1002");
  const mas = enPanel(page, "TB-1002").getByRole("button", { name: "Agregar una unidad" });
  await mas.click();
  await expect(enPanel(page, "TB-1002")).toContainText("2");
  await expect(mas).toBeDisabled();
});

test('"−" en 1 unidad saca el producto y la lista sobrevive a un F5', async ({ page }) => {
  await ir(page, "/productos");
  await agregar(page, "TB-2001");
  await panel(page).getByRole("button", { name: "✕" }).click(); // cerrar el panel
  await agregar(page, "TB-3001");
  await expect(enPanel(page, "TB-3001")).toBeVisible();
  await page.reload({ waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /Mi cotización/ }).first().click();
  await expect(enPanel(page, "TB-2001")).toBeVisible();
  await enPanel(page, "TB-2001").getByRole("button", { name: "Quitar una unidad" }).click();
  await expect(enPanel(page, "TB-2001")).toHaveCount(0);
  await expect(enPanel(page, "TB-3001")).toBeVisible();
});

test("enviar exige nombre, teléfono válido y autorización (Ley 1581)", async ({ page }) => {
  await ir(page, "/productos");
  await agregar(page, "TB-1001");
  await expect(botonEnviar(page)).toBeDisabled();

  await panel(page).getByPlaceholder("Tu nombre").fill("José");
  await panel(page).getByPlaceholder("Tu teléfono").fill("310 308");
  await panel(page).getByRole("checkbox").check();
  await expect(botonEnviar(page)).toBeDisabled(); // teléfono corto

  await panel(page).getByPlaceholder("Tu teléfono").fill("310 308 0416");
  await expect(botonEnviar(page)).toBeEnabled();
  await panel(page).getByRole("checkbox").uncheck();
  await expect(botonEnviar(page)).toBeDisabled(); // sin autorización
});

test("al enviar se abre WhatsApp con productos, nombre y teléfono", async ({ page }) => {
  await ir(page, "/productos");
  await agregar(page, "TB-1001");
  await panel(page).getByPlaceholder("Tu nombre").fill("José");
  await panel(page).getByPlaceholder("Tu teléfono").fill("3103080416");
  await panel(page).getByRole("checkbox").check();
  await botonEnviar(page).click();

  const abiertas = await page.evaluate(() => (window as unknown as { abiertas: string[] }).abiertas);
  expect(abiertas).toHaveLength(1);
  const url = new URL(abiertas[0]);
  expect(url.hostname).toBe("wa.me");
  const texto = url.searchParams.get("text") ?? "";
  expect(texto).toContain("1 x Turboalimentador CAT 3116 (Ref. TB-1001)");
  expect(texto).toContain("Nombre: José");
  expect(texto).toContain("Teléfono: 3103080416");
});

test("si el navegador bloquea la ventana nueva, WhatsApp se abre en la misma pestaña", async ({ page }) => {
  await page.addInitScript(() => {
    window.open = (() => null) as typeof window.open; // ventana emergente bloqueada
  });
  await page.route("https://wa.me/**", (r) => r.fulfill({ body: "WhatsApp (simulado)" }));
  await ir(page, "/productos");
  await agregar(page, "TB-2001");
  await panel(page).getByPlaceholder("Tu nombre").fill("Ana");
  await panel(page).getByPlaceholder("Tu teléfono").fill("3001234567");
  await panel(page).getByRole("checkbox").check();
  await botonEnviar(page).click();
  await expect(page).toHaveURL(/^https:\/\/wa\.me\//);
});
