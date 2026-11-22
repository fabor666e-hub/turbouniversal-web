// Arreglos de la revisión crítica como cliente (docs/specs/F1, sección "Revisión crítica").
import { expect, test } from "@playwright/test";
import { ir } from "./ir";

test("barra de marcas: con productos abre el catálogo; sin productos abre WhatsApp", async ({ page }) => {
  await ir(page, "/");
  const chevrolet = page.locator('[data-track="barra-marca-chevrolet"]').first();
  await expect(chevrolet).toHaveAttribute("href", "/productos?q=Chevrolet");
  const bmw = page.locator('[data-track="barra-marca-bmw-whatsapp"]').first();
  const href = (await bmw.getAttribute("href")) ?? "";
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(decodeURIComponent(href)).toContain("para BMW");
});

test("la ficha del producto permite agregar a la cotización", async ({ page }) => {
  await ir(page, "/productos/TB-2001");
  await page.getByRole("button", { name: "Agregar a cotización" }).click();
  await expect(page.locator('aside [data-ref="TB-2001"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /En cotización \(1\)/ }).first()).toBeVisible();
});

test("en un agotado la ficha no deja agregar y ofrece preguntar cuándo llega", async ({ page }) => {
  await ir(page, "/productos/TB-1003");
  await expect(page.getByRole("button", { name: "Agregar a cotización" })).toBeDisabled();
  await expect(page.getByRole("link", { name: "Preguntar por WhatsApp cuándo llega" })).toBeVisible();
});

test("la ficha muestra la garantía aunque no se haya informado", async ({ page }) => {
  await ir(page, "/productos/TB-1002");
  await expect(page.getByText("Consúltala con un asesor")).toBeVisible();
});

test.describe("en celular", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("el menú ☰ abre los enlaces y lleva al asistente", async ({ page }) => {
    await ir(page, "/");
    await expect(page.locator("#menu-movil")).toHaveCount(0);
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.locator("#menu-movil").getByRole("link", { name: "Asistente" }).click();
    await expect(page).toHaveURL(/\/asistente$/);
    await expect(page.locator("#menu-movil")).toHaveCount(0);
  });

  test("solo flota WhatsApp y no hay desplazamiento horizontal", async ({ page }) => {
    await ir(page, "/");
    await expect(page.locator('[data-track="whatsapp-flotante"]')).toBeVisible();
    await expect(page.locator('.fixed [data-track="instagram"]')).toHaveCount(0);
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(390);
  });
});

test("Nosotros tiene encabezado y sus cuatro bloques", async ({ page }) => {
  await ir(page, "/nosotros");
  await expect(page.getByRole("heading", { level: 1, name: "Nosotros" })).toBeVisible();
  await expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveCount(5); // 4 bloques + llamado final
});
