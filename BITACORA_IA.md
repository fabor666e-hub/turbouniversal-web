# Bitácora de IA

Registro de cómo se usó la IA en el proyecto: prompts clave, errores del agente o del proceso, y cómo se corrigieron.

## Herramientas
- Claude (chat) para planear, explicar y generar código; luego conectado a la carpeta del proyecto para leer, editar y verificar.
- Generador de imágenes con IA para las fotos de Nosotros.

## Prompts clave
| Momento | Prompt (resumen) | Resultado |
|---|---|---|
| Inicio | "Voy a hacer una página web enfocada al front para Turboman… estos son los problemas…" | Plan del proyecto y stack (Next.js + Tailwind + Supabase). |
| Contexto del proyecto | Prompt con stack, estructura, reglas (solo rojo y azul, español, sin librerías nuevas, RLS) y "Quiero agregar…" | Plantilla reutilizable para pedir cada funcionalidad. |
| F3 Asistente | "Quiero agregar un Asistente por vehículo… 3 pasos… sacar las opciones de los datos reales… Entrégame archivos completos, explicación y pasos para probar" | Página `/asistente` y componente `Asistente.tsx`. |
| SDD | "Necesito crear una base en SDD" | Constitución, producto, arquitectura y specs; luego reorganizado en `docs/` según la guía del curso. |
| F5 Administrador | "Implementa la spec 005" | Panel de productos con acciones de servidor; verificado con `tsc`, `eslint` y `next build`. |
| Variantes | "Crea 3 variantes de la pantalla principal en /prototipo/a, /b, /c" | Capturas a 390 px y 1280 px y elección con rúbrica. |
| Backend U4 | "El profesor me pidió usar Render para el backend y un sistema de especificaciones para el backend" | Contrato de la API, specs B1–B5, API NestJS con 32 pruebas y `render.yaml`. |
| Conectar front y API | "Que pasen por ahí pero igual lleguen a Supabase" | `lib/api.ts`, `lib/apiAdmin.ts`; la API es el camino principal y Supabase el respaldo. |
| Calidad U5 | Lista de entregables de la guía (pruebas, CI, interventoría, entornos, runbook, AWS) | Pruebas unitarias y e2e, CI, auditoría con 14 hallazgos, runbook y arquitectura desplegada. |

## Errores y cómo se corrigieron
| Error | Causa | Corrección | Aprendizaje |
|---|---|---|---|
| 404 en `/productos/TB-1001` | La carpeta se llamaba `producto` y no `productos` | Renombrar la carpeta | En App Router el nombre de la carpeta es la URL. |
| `Module not found: ./components/BuscadorHero` y `@/lib/utils` | Se importaron archivos que aún no existían | Crear los archivos faltantes | Crear primero los módulos que se importan. |
| `Cannot read properties of undefined (reading 'filter')` en Catálogo | La página no le pasaba `productos` al componente | Pasar `productos` como prop desde la página de servidor | Revisar las props que espera cada componente. |
| `generateStaticParams` con `productos` indefinido | Quedó código viejo al pasar a Supabase | Quitarlo y usar `force-dynamic` | Al cambiar la fuente de datos, revisar todo el archivo. |
| Supabase: "Invalid path specified in request URL" | La URL en `.env.local` tenía una ruta y `/` de más | Dejar solo `https://xxxx.supabase.co` y reiniciar | Las variables de entorno solo se leen al iniciar el servidor. |
| "Could not find the table public.eventos" | El SQL no se había ejecutado completo | Ejecutar el SQL y `notify pgrst, 'reload schema'` | Supabase cachea el esquema. |
| Íconos de redes invisibles | Clases `bg-white/10` y `text-red` (que no existe en Tailwind) | Círculo blanco con ícono azul | Verificar que la clase exista en Tailwind. |
| Colores fuera de la marca | La IA usó colores distintos por categoría | Alternar solo rojo y azul; regla en la constitución | Escribir las reglas de marca en los docs para que la IA no improvise. |
| `/asistente` daba 404 en Vercel | La carpeta quedó como `Asistente` (mayúscula); Windows no distingue, Vercel sí | `git mv` en dos pasos a `asistente` | Rutas siempre en minúscula. |
| Subrayado rojo en `Opcion` | Componente definido dentro de otro componente | Sacarlo fuera de `Asistente` | Regla de React: no crear componentes durante el render. |
| `git push`: Repository not found | El repositorio se renombró y el remoto quedó viejo | `git remote set-url origin …/turbouniversal-web.git` | Al renombrar un repo, actualizar el remoto. |
| `Error leyendo Supabase: fetch failed` y clics lentos | El proyecto gratuito de Supabase se pausó por inactividad | Restaurar el proyecto; el sitio siguió con datos mock | El plan gratuito se pausa; antes de una demo, revisar que esté activo. |
| El panel nunca mostraba clics | `<RastreoClics />` quedó pegado entre los `import` de `layout.tsx` | Ponerlo dentro del `Proveedor` | Revisar `git diff` antes de aceptar cambios. |
| Fotos de IA con el logotipo de otra marca (Garrett) | El generador agregó marcas reales | Pendiente regenerarlas pidiendo "sin logotipos" | Revisar las imágenes generadas antes de publicarlas. |
| ESLint: `useContext` en `usarCotizacion` | El hook tiene nombre en español (no empieza por `use`) | Comentario de excepción documentado | Las reglas de React dependen del nombre del hook. |
| El sitio usaba Arial y no Geist | `globals.css` fijaba `font-family: Arial` en `body` | Usar `var(--font-geist-sans)` | Comparar la identidad visual con lo que realmente se ve. |
| Contraste de botones rojos y verdes por debajo de AA | Blanco sobre `#e8233b` da 4.44:1 y sobre verde 3.3:1 | Documentado; pendiente oscurecer los botones | Medir el contraste, no suponerlo. |
| Render: `Falta la variable de entorno DATABASE_URL` | El Blueprint dejó `DATABASE_URL` y `PANEL_CLAVE` sin crear (`sync: false`) | Crearlas en Render → Environment | Las variables secretas de un Blueprint se llenan a mano. |
| Render: `ENETUNREACH 2600:…` | Se usó la conexión directa de Supabase, que es solo IPv6 | URI del Session pooler (usuario `postgres.<id>`, host `pooler.supabase.com`) | Render no tiene IPv6 de salida: siempre el pooler. |
| Render: `password authentication failed` | La contraseña no era la de la base (y se habían dejado los corchetes `[ ]`) | Reset database password y URI sin corchetes | La contraseña de la base no es la de la cuenta. |
| Contraseña de la base visible en una captura | Se compartió la pantalla de variables con el valor a la vista | Se cambió la contraseña | Nunca compartir capturas con secretos visibles. |
| Despliegues rojos en Vercel | `tsconfig.json` revisaba `backend/` sin sus paquetes; luego se subió `lib/` sin `app/` por la web de GitHub | Excluir `backend/` y subir los archivos que faltaban | Por eso se agregó CI y `main` protegida. |
| El botón de WhatsApp no abría nada | El navegador del computador de la universidad bloqueaba ventanas emergentes | Si se bloquea, abrir en la misma pestaña | Probar en otros equipos y navegadores, no solo en el propio. |
| `npm install vitest` fallaba (`edgesOut`) | Conflicto de npm con las dependencias opcionales de Vitest | Usar Playwright también para las unitarias | Si una herramienta no instala, buscar la que ya está en el proyecto. |
| Pruebas e2e que fallaban al azar | Con streaming (`loading.tsx`) el contenido aparece dos veces por un instante | Esperar a que cargue la página (`ir()` en `tests/e2e/ir.ts`) y buscar solo elementos visibles | Una prueba que falla "a veces" tiene una causa; correrla varias veces. |
| `migrations` sin RLS en Supabase | TypeORM creó su tabla de control en `public` y Supabase la expone | RLS activado y permisos retirados (A-01) | Correr el Security Advisor después de cada cambio de esquema. |
| Next.js con vulnerabilidades críticas | Versión 16.3.8 afectada por avisos publicados en noviembre | Actualizar a 16.4.6 (A-02) | Correr `npm audit` antes de cada entrega. |

## Interventoría
- Cada cambio del agente se revisó en el navegador y con `git diff` antes del commit.
- Los criterios de aceptación de F1 a F3 tienen pruebas automáticas (unitarias y e2e) que corren en el CI.
- Auditoría propia e interventoría cruzada: docs/calidad/interventoria.md.
- F5 está implementada y compila; falta probarla con Supabase activo.

## Métricas (al 21 de noviembre de 2026)
| Métrica | Valor |
|---|---|
| Duración del proyecto | 3 oct – 21 nov 2026 (7 semanas) |
| Specs con criterios de aceptación | 10 (F1–F5 y B1–B5) + plantilla F0 |
| Pruebas automáticas | 76: 17 unitarias + 22 e2e (front) y 37 de la API contra PostgreSQL |
| Criterios de F1–F3 cubiertos por pruebas | Todos los verificables sin servicios externos (los de rastreo y panel se prueban en la API, B2–B3) |
| Tiempo del CI | ~1 min unitarias + build, ~35 s e2e, ~10 s API (medido en local) |
| Errores registrados en esta bitácora | 27 |
| Hallazgos de la auditoría propia | 14 (11 corregidos, 3 pendientes que dependen de la empresa o del dueño de las cuentas) |
| Vulnerabilidades en dependencias de producción | 0 (`npm audit --omit=dev`, front), antes 1 crítica |
| Despliegues fallidos antes del CI | Vercel 2 de 14, Render 3 de 6 (todos por configuración, ninguno por la lógica) |
| Líneas de código | ~4.400 del front y ~950 de la API (TypeScript) |

## Riesgos encontrados
| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| La IA inventa o asume (colores, nombres de carpetas, datos de la empresa) | Alta | Medio | Reglas en `CLAUDE.md` y docs; revisar `git diff`; datos de la empresa marcados como "por confirmar" (tarea 3.5). |
| Secretos expuestos al trabajar con IA o en capturas | Media | Alto | Claves solo en Vercel, Render y `.env.local`; nunca en el chat ni en el código; rotación descrita en el runbook. |
| Cambios del agente que compilan en local pero rompen producción | Media | Alto | CI obligatorio, `main` protegida y preview por PR. |
| Planes gratis: Render se duerme y Supabase se pausa | Alta | Medio | Respaldo a Supabase directo y a datos locales; checklist del demo day. |
| Pruebas frágiles que se ignoran | Media | Medio | Esperas explícitas, selectores por rol y `data-ref`; se corrieron 4 veces seguidas en verde antes de entregar. |
| Imágenes generadas con IA con marcas de terceros | Media | Medio | Revisar cada imagen antes de publicar (A-13). |
| Dependencia de un solo proveedor por pieza | Baja | Medio | `DATABASE_URL` y equivalentes en AWS documentados; la API corre en cualquier servidor con Node. |
