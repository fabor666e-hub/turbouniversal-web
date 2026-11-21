import { defineConfig, devices } from "@playwright/test";

// Un solo ejecutor para las dos clases de pruebas:
//   npm test       → pruebas unitarias (tests/unit), sin navegador
//   npm run e2e    → pruebas de extremo a extremo (tests/e2e), con el sitio compilado
// Las e2e corren con los datos locales de data/productos.ts (sin Supabase ni API),
// así siempre dan el mismo resultado.
const PUERTO = 3100;

export default defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  projects: [
    { name: "unit", testDir: "tests/unit" },
    {
      name: "e2e",
      testDir: "tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://localhost:${PUERTO}`,
        trace: "retain-on-failure",
      },
    },
  ],
  webServer: process.argv.includes("--project=unit")
    ? undefined
    : {
        // Requiere `npm run build` antes (el CI lo hace en un paso aparte)
        command: `npx next start -p ${PUERTO}`,
        url: `http://localhost:${PUERTO}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        env: { PANEL_CLAVE: "clave-de-prueba" },
      },
});
