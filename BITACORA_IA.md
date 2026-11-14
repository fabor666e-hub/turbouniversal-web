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

## Interventoría
- Cada cambio del agente se revisó en el navegador y con `git diff` antes del commit.
- Los criterios de aceptación de F1 a F3 se verificaron en el navegador a 390 px con datos mock.
- F5 está implementada y compila; falta probarla con Supabase activo.
