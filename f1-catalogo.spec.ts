// F1 · Catálogo y buscador (docs/specs/F1-catalogo-buscador.md)
import { expect, test } from "@playwright/test";
import { ir } from "./ir";

const tarjeta = (page: import("@playwright/test").Page, ref: string) =>
  page.locator(`div[data-ref="${ref}"]:visible`);

test('buscar "npr" en el inicio lleva a /productos?q=npr con solo productos NPR', async ({ page }) => {
  await ir(page, "/");
  const buscador = page.getByPlaceholder("Ej: HX35, Chevrolet NPR, Duster...").first();
  await buscador.fill("npr");
  await buscador.press("Enter");
  await expect(page).toHaveURL(/\/productos\?q=npr/);

  const tarjetas = page.locator("div[data-ref]:visible");
  await expect(tarjetas.first()).toBeVisible();
  for (const t of await tarjetas.all()) await expect(t).toContainText("NPR");
  await expect(tarjeta(page, "TB-1001")).toHaveCount(0); // CAT 3116 no es NPR
});

test('"geometria" sin tilde encuentra "Geometría variable"', async ({ page }) => {
  await ir(page, "/productos?q=geometria");
  await expect(tarjeta(page, "TB-6001")).toContainText("Geometría variable");
  await expect(page.locator("div[data-ref]:visible")).toHaveCount(1);
});

test("una categoría muestra solo sus productos", async ({ page }) => {
  await ir(page, "/productos?cat=cartridge");
  await expect(page.locator("div[data-ref]:visible")).toHaveCount(2);
  const refs = await page.locator("div[data-ref]:visible").evaluateAll((els) =>
    els.map((e) => e.getAttribute("data-ref"))
  );
  expect(refs.sort()).toEqual(["TB-2001", "TB-2002"]);
});

test("cada tarjeta muestra el estado de stock y un agotado no se puede cotizar", async ({ page }) => {
  await ir(page, "/productos");
  await expect(tarjeta(page, "TB-1003")).toContainText("Agotado");
  await expect(tarjeta(page, "TB-1003").getByRole("button")).toBeDisabled();
  await expect(tarjeta(page, "TB-1002")).toContainText("Pocas unidades (2)");
  await expect(tarjeta(page, "TB-2001")).toContainText("Disponible (12)");
});

test("la página del producto muestra sus datos y el título de la pestaña", async ({ page }) => {
  await ir(page, "/productos/TB-1001");
  await expect(page).toHaveTitle(/Turboalimentador CAT 3116/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Turboalimentador CAT 3116");
});

test("una dirección que no existe muestra la 404 propia", async ({ page }) => {
  const r = await ir(page, "/abc-no-existe");
  expect(r?.status()).toBe(404);
  await expect(page.getByText("Esta página se quedó sin turbo").filter({ visible: true })).toBeVisible();
});
