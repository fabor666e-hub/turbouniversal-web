// F3 · Asistente por vehículo (docs/specs/F3-asistente-vehiculo.md)
import { expect, test } from "@playwright/test";
import { ir } from "./ir";

test("el menú lleva al asistente", async ({ page }) => {
  await ir(page, "/");
  await page.getByRole("navigation").getByRole("link", { name: "Asistente" }).first().click();
  await expect(page).toHaveURL(/\/asistente$/);
  await expect(page.getByText("¿De qué marca es tu vehículo?")).toBeVisible();
});

test("Chevrolet → NPR → Ver todos muestra solo productos compatibles", async ({ page }) => {
  await ir(page, "/asistente");
  await page.getByRole("button", { name: "Chevrolet", exact: true }).click();
  await expect(page.getByText("¿Qué modelo de Chevrolet?")).toBeVisible();
  await page.getByRole("button", { name: "NPR", exact: true }).click();
  await page.getByRole("button", { name: "Ver todos", exact: true }).click();

  await expect(page.getByText(/6 resultados para/)).toBeVisible();
  const tarjetas = page.locator("div[data-ref]:visible");
  await expect(tarjetas).toHaveCount(6);
  for (const t of await tarjetas.all()) await expect(t).toContainText("Chevrolet NPR");
});

test("la barra de progreso avanza, Atrás retrocede y Empezar de nuevo vuelve al paso 1", async ({ page }) => {
  await ir(page, "/asistente");
  await expect(page.getByText("Paso 1 de 3")).toBeVisible();
  await page.getByRole("button", { name: "Renault", exact: true }).click();
  await expect(page.getByText("Paso 2 de 3")).toBeVisible();
  await page.getByRole("button", { name: "Duster", exact: true }).click();
  await expect(page.getByText("Paso 3 de 3")).toBeVisible();

  await page.getByRole("button", { name: "← Atrás" }).click();
  await expect(page.getByText("¿Qué modelo de Renault?")).toBeVisible();
  await page.getByRole("button", { name: "Empezar de nuevo" }).click();
  await expect(page.getByText("¿De qué marca es tu vehículo?")).toBeVisible();
});
