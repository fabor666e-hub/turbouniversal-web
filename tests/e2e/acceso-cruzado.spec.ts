// Acceso cruzado: un visitante no puede ver ni cambiar los datos del panel (F4) ni del
// administrador (F5) sin la clave, aunque escriba la dirección o falsifique la cookie.
// (Las mismas reglas en la API se prueban en backend/test/api.e2e-spec.ts.)
import { expect, test } from "@playwright/test";
import { ir } from "./ir";

const CLAVE = "clave-de-prueba"; // la define playwright.config.ts para el servidor de pruebas

test("sin sesión, /panel solo muestra el formulario de clave", async ({ page }) => {
  await ir(page, "/panel");
  await expect(page.getByRole("heading", { name: "Panel privado" })).toBeVisible();
  await expect(page.getByText("Panel de datos")).toHaveCount(0);
  await expect(page.getByText("Últimas cotizaciones")).toHaveCount(0);
});

for (const ruta of ["/panel/productos", "/panel/productos/nuevo", "/panel/productos/TB-1001"]) {
  test(`sin sesión, ${ruta} redirige al formulario de clave`, async ({ page }) => {
    await ir(page, ruta);
    await expect(page).toHaveURL(/\/panel$/);
    await expect(page.getByRole("heading", { name: "Panel privado" })).toBeVisible();
  });
}

test("una cookie falsificada no abre el panel", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "panel", value: "adivinando", url: baseURL! }]);
  await ir(page, "/panel/productos");
  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByRole("heading", { name: "Panel privado" })).toBeVisible();
});

test("una clave incorrecta no abre el panel", async ({ page }) => {
  await ir(page, "/panel");
  await page.getByPlaceholder("Contraseña").fill("clave-equivocada");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Panel privado" })).toBeVisible();
});

test("con la clave correcta sí entra al panel", async ({ page }) => {
  await ir(page, "/panel");
  await page.getByPlaceholder("Contraseña").fill(CLAVE);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Panel privado" })).toHaveCount(0);
});
