@AGENTS.md

# Proyecto: Turbo Universal Web

Sitio de Importadora Turbo Universal (distribuidora oficial de Turboman y Master Power): catálogo con buscador, cotización por WhatsApp, asistente por vehículo, panel de analítica y administrador de productos.

## Stack
- Front: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
- Back (U4): API REST NestJS + TypeScript en `backend/`, PostgreSQL con TypeORM
- Datos: PostgreSQL (Render o Supabase vía `DATABASE_URL`); datos mock de respaldo en `data/productos.ts`
- Despliegue: GitHub → Vercel (front) y GitHub → Render (API)

## Documentación (léela antes de cualquier cambio)
- Qué es el producto y qué NO entra: @docs/producto.md
- Tecnología, estructura y datos: @docs/arquitectura.md
- Pantallas y estilos: @docs/diseno/identidad-visual.md
- Funcionalidades y criterios de aceptación: docs/specs/ (front F1 a F5, back B1 a B5, plantilla en F0)
- Contrato entre front y back (rutas, cuerpos, errores): @docs/contratos/api.md
- Decisiones tomadas y por qué: docs/decisiones.md
- Qué sigue: docs/tareas.md
- Errores y aprendizajes con IA: BITACORA_IA.md

## Reglas de trabajo
- Implementa UNA tarea de docs/tareas.md a la vez y márcala al terminar.
- No agregues funcionalidades que no estén en docs/specs/.
- Si el alcance cambia, propón primero el cambio en los docs y después el código.
- No toques archivos que la tarea no requiera.
- Nunca escribas llaves o tokens en el código: usa variables de entorno (`.env.local`).
- La clave `service_role` solo se usa en el servidor (`lib/supabaseAdmin.ts`).
- No agregues librerías nuevas si se puede hacer con Tailwind, CSS o React.
- Al terminar cada tarea, explica cómo probarla en el navegador (front) o con curl/Postman (back).
- Ninguna ruta de la API se crea o cambia sin actualizar antes docs/contratos/api.md.

## Convenciones
- Componentes en `app/components/`, en PascalCase. Rutas (carpetas de `app/`) en minúscula.
- Textos de la interfaz en español de Colombia. Diseño mobile first.
- Solo rojo `#e8233b` y azul `#1a2150` como colores de marca. Para UI usa la skill `ui-componentes`.
