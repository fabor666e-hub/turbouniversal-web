# Decisiones

| Fecha | Decisión | Por qué |
|---|---|---|
| 2026-10 | Next.js + Tailwind para el front | Stack del diplomado; páginas por producto que Google puede leer (SEO). |
| 2026-10 | Supabase en vez de Spring Boot + MySQL para el MVP | La guía permite Supabase y Vercel como alternativa rápida; da base de datos, API y seguridad (RLS) sin montar un servidor. |
| 2026-10 | Vercel para publicar | Despliegue continuo desde GitHub y plan gratuito para el MVP. |
| 2026-10 | La cotización se envía por WhatsApp (no por correo ni pago en línea) | La empresa ya atiende por WhatsApp; el cambio para ellos es mínimo. La cotización también se guarda en Supabase. |
| 2026-10 | Solo rojo `#e8233b` y azul `#1a2150` | Son los colores del logo; la empresa pidió mantenerlos. |
| 2026-10 | Datos mock en `data/productos.ts` como respaldo | Si Supabase falla o está pausado, el sitio no se cae. |
| 2026-11 | Pantalla principal: **variante A · Buscador primero** | Ganó en la rúbrica: la acción principal (buscar) es lo que más resalta, se entiende en 5 s y funciona a 390 px. B obliga a escoger entre dos botones antes de buscar; C depende de que los vehículos estén bien escritos en los datos. Capturas en docs/diseno/referencias/. |
| 2026-11 | Paso 3 del asistente = tipo de repuesto (no combustible) | Los productos no tienen campo de combustible; las opciones salen de datos reales. |
| 2026-11 | La cotización se guarda en `localStorage` | Evita que el cliente pierda su lista al recargar. |
| 2026-11 | Administrador de productos con acciones de servidor y clave secreta | No se abren permisos de escritura al público en Supabase. |
| 2026-11 | Fotos de Nosotros generadas con IA | La empresa no tiene fotos propias; pendiente reemplazar las que muestran logotipos de otras marcas. |
| 2026-11 | Rediseño con línea más corporativa, manteniendo rojo y azul | La empresa necesita transmitir seriedad y confianza: se quitaron cortes diagonales, píldoras, rebotes y giros; se usan bordes rectos, cuadrícula técnica y botones sobrios. |
| 2026-11 | Backend con NestJS + TypeScript | El profesor lo incluyó en el stack del curso; usa el mismo lenguaje del front, es liviano para el plan gratuito de Render y sigue una estructura por módulos fácil de explicar. Spring Boot queda como alternativa del diplomado. |
| 2026-11 | API publicada en Render | Indicación del profesor; despliega desde GitHub como Vercel y tiene plan gratuito para el MVP. |
| 2026-11 | PostgreSQL detrás de `DATABASE_URL` | Funciona igual con Render PostgreSQL o con Supabase; si la base gratuita de Render vence (30 días), se cambia una variable y no el código. |
| 2026-11 | El precio de la cotización lo calcula el servidor | Evita que alguien modifique precios desde el navegador. |
| 2026-11 | Contrato de la API antes del código (docs/contratos/api.md) | Método SDD: front y back se ponen de acuerdo en un documento; las specs B1 a B5 tienen criterios verificables con curl o Postman. |
| 2026-11 | La API en Render usa la base de Supabase (no una base nueva en Render) | La base gratuita de Render vence a los 30 días; Supabase ya tiene los datos y solo se pausa por inactividad. Se conecta por el Session pooler (IPv4) con SSL. |
| 2026-11 | El front pasa por la API y Supabase queda como respaldo | La API valida y calcula precios en el servidor. Render gratis tarda ~50 s en despertar: las lecturas esperan 4 s y luego leen Supabase directo; eventos y cotizaciones se guardan directo si la API falla. Las escrituras del administrador no se repiten en Supabase si la API tarda, para no duplicar cambios. |
| 2026-11 | Playwright para pruebas unitarias y e2e del front | Un solo ejecutor para las dos clases de prueba y para el navegador. Vitest no se pudo instalar (conflicto de dependencias de npm con su complemento de navegador); Playwright ya estaba en el entorno y corre TypeScript con los alias `@/`. |
| 2026-11 | Reglas de negocio del front en `lib/reglas.ts` | Separarlas de los componentes de React permite probarlas sin navegador; los componentes solo llaman esas funciones. |
| 2026-11 | Las e2e corren con los datos locales (sin Supabase ni API) | Resultados repetibles en el CI y sin tocar la base de producción. La parte de base de datos se prueba en `backend/test` contra un PostgreSQL desechable del CI. |
| 2026-11 | Regla crítica = precio y total calculados en el servidor y nunca más que el stock; acceso cruzado = sin clave nadie ve ni cambia datos del panel | Son las dos reglas cuyo fallo causa daño real (precios alterados, ventas sin inventario, exposición de datos de clientes). Se prueban en el front y en la API. |
| 2026-11 | CI en GitHub Actions y `main` protegida | Un despliegue roto llegó a producción por subir archivos a medias; con PR obligatorio y CI en verde eso ya no puede pasar. |
| 2026-11 | Entornos separados: Supabase `turboman` (prod) y `turboman-dev` (dev y previews) | Los previews de cada PR y el trabajo local no deben escribir en la base real. Los previews no usan la API de Render porque esa API está conectada a producción. |
| 2026-11 | Rollback con Instant Rollback de Vercel y Rollback de Render | Vuelven en segundos a un despliegue que funcionaba sin recompilar; las migraciones solo agregan, así que un rollback de código no daña datos. |
| 2026-11 | Next.js 16.4.6 (antes 16.3.8) | `npm audit` reportó vulnerabilidades críticas en 16.3.8; 16.4.6 es la versión corregida de la misma línea. |
| 2026-11 | RLS en la tabla `migrations` de TypeORM | El Security Advisor de Supabase la marcó como expuesta a la clave pública; se protegió en producción y en una migración para las bases nuevas. |

## Rúbrica de las variantes (1 = bajo, 3 = alto)

| Criterio | A · Buscador primero | B · Catálogo visual | C · Por vehículo |
|---|---|---|---|
| Claridad (5 s) | 3 | 2 | 3 |
| Jerarquía (acción principal resalta) | 3 | 2 | 2 |
| Consistencia con la identidad | 3 | 3 | 2 |
| Responsivo (390 px) | 3 | 3 | 3 |
| Accesibilidad | 2 | 2 | 2 |
| **Total** | **14** | **12** | **12** |
