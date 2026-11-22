# Interventoría · Turbo Universal

Revisión de calidad del proyecto en dos partes:

1. **Auditoría propia**: revisión del equipo, hecha el 21 de noviembre de 2026 sobre la rama `main` y los servicios publicados.
2. **Interventoría cruzada**: issues que reporta otro equipo del curso y cómo se corrigen.

Cada hallazgo tiene severidad, evidencia, corrección y cómo se verifica que no vuelva a pasar.

**Severidad:**
- **Crítica**: expone datos o deja el sitio caído.
- **Alta**: rompe una funcionalidad principal.
- **Media**: afecta a una parte de los usuarios o a la operación.
- **Baja**: es de forma o de documentación.

## 1. Alcance y método

| Área | Qué se revisó | Herramienta |
|---|---|---|
| Funcionalidad | Criterios de aceptación de F1, F2 y F3 (docs/specs) | Pruebas unitarias y e2e (`tests/`), navegador a 390 px y en escritorio |
| Regla crítica | El precio y el total los calcula el servidor; nunca se cotiza más que el stock | `tests/unit/reglas.spec.ts`, `tests/e2e/f2-cotizacion.spec.ts` y `backend/test/api.e2e-spec.ts` (B2) |
| Acceso cruzado | Sin la clave nadie ve ni cambia datos del panel o del administrador, ni por la página ni por la API | `tests/e2e/acceso-cruzado.spec.ts` y el bloque "Acceso cruzado" de `backend/test/api.e2e-spec.ts` |
| Seguridad de datos | RLS de Supabase, claves y variables de entorno | Security Advisor de Supabase, `pg_policies` y revisión de Vercel y Render |
| Dependencias | Vulnerabilidades conocidas | `npm audit --omit=dev` (front y back) |
| Despliegue | Build en Vercel, arranque en Render, CORS | Registros de Vercel y Render |

## 2. Auditoría propia: hallazgos y correcciones

| ID | Hallazgo | Severidad | Evidencia | Corrección | Verificación | Estado |
|---|---|---|---|---|---|---|
| A-01 | La tabla `public.migrations` (la crea la API con TypeORM) estaba **sin RLS**, y la clave pública (anon) tenía todos los permisos sobre ella. | Crítica | Supabase Security Advisor: `rls_disabled_in_public` (ERROR) | RLS activado y permisos de `anon` y `authenticated` retirados, en producción y en la migración `1764100000000-RlsMigraciones.ts`, para que toda base nueva quede igual | El Advisor ya no muestra el error; queda solo un aviso informativo de "RLS sin políticas", que es lo esperado | ✅ Corregido |
| A-02 | Next.js 16.3.8 tenía avisos de seguridad **críticos**: ejecución remota en la optimización de imágenes SVG y en `use cache`, y denegación de servicio con Server Actions. | Crítica | `npm audit --omit=dev` → `next 16.0.0 – 16.4.4` | Actualizado a Next.js **16.4.6** (y `eslint-config-next` 16.4.6) | `npm audit --omit=dev` → 0 vulnerabilidades; build y las 39 pruebas del front en verde | ✅ Corregido |
| A-03 | La contraseña de la base de datos quedó visible en una captura de pantalla durante la configuración de Render. | Crítica | Captura del panel de variables de Render | Se cambió la contraseña de la base en Supabase (Reset database password) y se actualizó `DATABASE_URL` en Render | La API arranca con la contraseña nueva (`/api/salud` → ok) | ✅ Corregido |
| A-04 | `PANEL_CLAVE` era igual a la contraseña anterior de la base de datos. | Alta | Variables de Render | Poner una clave propia, distinta y larga, al mismo tiempo en Render y en Vercel Production (runbook, sección "Cambiar una clave") | Entrar al panel con la clave nueva; la anterior ya no sirve | ⏳ Pendiente (la hace el dueño de las cuentas) |
| A-05 | El despliegue de Vercel fallaba: el `tsconfig.json` del front incluía `backend/`, y TypeScript no encontraba los paquetes de NestJS. | Alta | Despliegues fallidos de `ae5560a` y `ea71bf2` en GitHub | `"exclude": ["node_modules", "backend"]` en `tsconfig.json`; `backend/**` ignorado en ESLint | El CI compila el front sin el backend; despliegue en verde | ✅ Corregido |
| A-06 | Un despliegue se publicó con archivos a medias (se subió `lib/` sin `app/`) y rompió el build de producción. | Alta | Despliegue `ea71bf2` en rojo | CI obligatorio y rama `main` protegida: no se puede fusionar un cambio que no compile ni pase las pruebas | `.github/workflows/ci.yml` y regla de protección de `main` | ✅ Corregido (protección: ver runbook) |
| A-07 | Render no conectaba con Supabase: `ENETUNREACH` (conexión directa solo IPv6) y luego `password authentication failed`. | Alta | Registros de Render | Usar la URI del **Session pooler** con la contraseña nueva | `Nest application successfully started` y "Your service is live" | ✅ Corregido |
| A-08 | La API rechazaría los clics y las cotizaciones enviados desde el dominio real, porque `ORIGEN_FRONT` (CORS) tenía `turboman-web.vercel.app` y el sitio está en `turbouniversal-web.vercel.app`. | Media | Comparación de los dominios de Vercel y Render | Agregar `https://turbouniversal-web.vercel.app` a `ORIGEN_FRONT` | Prueba B1 "CORS: un dominio no permitido no recibe permiso"; en el navegador, las peticiones a `/api/eventos` responden 202 | ✅ Corregido |
| A-09 | El botón "Enviar cotización por WhatsApp" no hacía nada en navegadores que bloquean ventanas emergentes. | Alta | Reporte de uso en un computador de la universidad | WhatsApp se abre primero; si el navegador bloquea la ventana nueva, se abre en la misma pestaña. Guardar la cotización nunca impide abrir WhatsApp | e2e: "si el navegador bloquea la ventana nueva, WhatsApp se abre en la misma pestaña" | ✅ Corregido |
| A-10 | La cotización pedía nombre y teléfono sin autorización expresa para tratar los datos (Ley 1581 de 2012). | Media | Revisión del formulario de F2 | Casilla obligatoria de autorización. La API también la exige (`aceptaDatos: true`) | Unitaria `cotizacionLista` y e2e "enviar exige nombre, teléfono válido y autorización" | ✅ Corregido (falta publicar la política completa, tarea 3.4) |
| A-11 | La API gratuita de Render tarda unos 50 s en despertar; la página quedaba esperando. | Media | Aviso de Render "spin down with inactivity" | Las lecturas esperan 4 s y luego leen Supabase directo; eventos y cotizaciones se guardan directo si la API falla; el panel muestra de dónde salen los datos | Prueba manual con la API apagada: el panel muestra "Supabase directo" | ✅ Mitigado |
| A-12 | Los botones "−" y "+" de la cotización no tenían nombre accesible (lectores de pantalla). | Baja | Árbol de accesibilidad en Playwright | `aria-label="Quitar una unidad"` y `"Agregar una unidad"` | Las e2e de F2 usan esos nombres | ✅ Corregido |
| A-13 | Las fotos de Nosotros (hechas con IA) muestran el logotipo de otra marca (Garrett). | Media | Revisión visual de `/nosotros` | Regenerarlas sin logotipos o usar fotos reales de la empresa | Revisión visual | ⏳ Pendiente (tarea 3.2) |
| A-14 | Faltan datos por confirmar con la empresa: número de WhatsApp, dirección de Medellín, teléfono y horario de Cali y Duitama. | Media | `app/puntos-de-venta/page.tsx` | Confirmar con la empresa antes del demo day | Revisión con la empresa | ⏳ Pendiente (tarea 3.5) |

### Lo que se revisó y está bien
- **RLS de las tablas de negocio:**
  - `productos`: el público solo lee.
  - `eventos` y `cotizaciones`: el público solo inserta.
  - El panel y el administrador usan la clave secreta, y solo en el servidor (`lib/supabaseAdmin.ts`, `lib/apiAdmin.ts`).
- **Regla crítica en el servidor:**
  - La API toma nombre y precio de la base de datos, ignora un precio inventado en el cuerpo y responde `409 STOCK_INSUFICIENTE` si se pide más que el stock (pruebas B2).
- **Acceso cruzado en la API** (pruebas "Acceso cruzado"). Responden **401**:
  - un token firmado con otro secreto;
  - un token sin rol `admin`;
  - un token vencido;
  - la `PANEL_CLAVE` usada como token;
  - un token sin la palabra `Bearer`.
  
  Después de esos intentos, el stock no cambió.
- **Acceso cruzado en la página** (e2e). Sin sesión:
  - `/panel` solo muestra el formulario de clave;
  - `/panel/productos`, `/nuevo` y `/[referencia]` redirigen a `/panel`;
  - una cookie falsificada o una clave incorrecta no abren el panel.
- **Límites de abuso:**
  - 60 eventos por minuto por IP;
  - 5 intentos de inicio de sesión por minuto (pruebas B3 y B4).
- **Claves:**
  - ninguna clave está en el código ni en GitHub;
  - `.env*` está en `.gitignore`;
  - las claves se guardan solo en Vercel y Render.

## 3. Interventoría cruzada (equipo revisor)

**Equipo revisor:** _______________________ · **Fecha:** ____ / ____ / 2026 · **Versión revisada:** commit `_______`

**Cómo se registra:** cada observación del otro equipo se abre como **issue** en GitHub con la etiqueta `interventoria`. Se corrige en una rama y se cierra con un PR que diga `Closes #N`. Ese PR pasa por el CI y por la vista previa (preview) antes de llegar a producción.

| Issue | Observación del equipo revisor | Severidad | Corrección (PR) | Verificación | Estado |
|---|---|---|---|---|---|
| #__ |  |  |  |  |  |
| #__ |  |  |  |  |  |
| #__ |  |  |  |  |  |

### Guía para el equipo revisor
Para que la revisión sea comparable, se sugiere revisar:
1. **F1:** buscar "npr" y "geometria", filtrar por categoría, abrir un producto y una dirección que no existe.
2. **F2:** intentar cotizar más unidades que el stock. Intentar enviar sin nombre, con un teléfono corto o sin marcar la autorización.
3. **F3:** asistente Chevrolet → NPR → Ver todos; los botones "Atrás" y "Empezar de nuevo".
4. **Acceso cruzado:**
   - entrar a `/panel/productos` sin clave;
   - llamar `GET https://turbouniversal-api-evth.onrender.com/api/panel/resumen` sin token o con un token inventado.
5. **En el celular (390 px):** que no haya desplazamiento horizontal y que los botones se puedan tocar.

## 4. Resumen

| | Total | Corregidos | Pendientes |
|---|---|---|---|
| Auditoría propia | 14 | 11 | 3 (A-04, A-13, A-14) |
| Interventoría cruzada | — | — | — |

**Pruebas automáticas en el CI:**
- Front: 17 unitarias y 22 e2e.
- Back: 37 pruebas contra PostgreSQL.
