# Tareas

Ciclo de cada tarea: implementar UNA → probar en el navegador → commit → marcar [x].

## Front (U3)
- [x] 1.1 Proyecto Next.js + Tailwind + TypeScript y repositorio en GitHub
- [x] 1.2 Layout base con identidad visual: logo, menú, pie, colores rojo y azul, acento dinámico
- [x] 1.3 Datos mock de productos y categorías (`data/productos.ts`)
- [x] 1.4 F1 · Inicio con hero, buscador, ventajas, categorías y destacados
- [x] 1.5 F1 · Catálogo con buscador sin tildes y filtro por categoría
- [x] 1.6 F1 · Página de cada producto con estado de stock
- [x] 1.7 F2 · Contexto de cotización y panel lateral con cantidades
- [x] 1.8 F2 · Envío por WhatsApp con nombre y teléfono
- [x] 1.9 F2 · Cotización guardada al recargar (localStorage)
- [x] 1.10 F1 · Páginas Nosotros (scroll con imágenes) y Puntos de venta (Bogotá, Medellín, Cali y Duitama con mapa)
- [x] 1.11 F1 · Página Marcas con logos de Turboman y Master Power
- [x] 1.12 F3 · Asistente por vehículo en 3 pasos
- [x] 1.13 F1 · Página 404 propia y pantalla de carga
- [x] 1.14 Variantes de la pantalla principal en /prototipo/a, /b, /c y elección (docs/decisiones.md)
- [x] 1.15 Publicación en Vercel con despliegue continuo
- [x] 1.16 Íconos SVG de la marca en lugar de emojis
- [x] 1.17 Ícono de pestaña (favicon) e imagen para compartir el enlace (Open Graph)
- [x] 1.18 Franja de marcas (Turboman y Master Power) en el inicio
- [x] 1.19 Pie de página con sedes, teléfonos, correo, horario y redes
- [x] 1.20 Rediseño con línea corporativa manteniendo rojo y azul
- [x] 1.21 Sección de videos de YouTube en el inicio (carga el reproductor solo al hacer clic)
- [x] 1.22 Empresas aliadas (Turbotec y Uniturbos) en el inicio y en Marcas
- [x] 1.23 Barra deslizable con las marcas de vehículos en el inicio

## Datos y panel (adelantado de la U4)
- [x] 2.1 Conexión a Supabase con respaldo en datos mock
- [x] 2.2 Tablas `productos`, `eventos`, `cotizaciones` con políticas RLS
- [x] 2.3 Rastreo de vistas, búsquedas, categorías, clics y cotizaciones
- [x] 2.4 F4 · Panel de analítica con contraseña
- [x] 2.5 F5 · Administrador de productos (crear, editar, stock, borrar)
- [ ] 2.6 Probar F5 con Supabase activo

## Back (U4) · API en Render
- [x] 4.1 Contrato de la API (docs/contratos/api.md) y specs B1 a B5
- [x] 4.2 Proyecto NestJS en `backend/` con conexión a PostgreSQL, CORS, prefijo /api y formato de errores
- [x] 4.3 Migración inicial (productos, eventos, cotizaciones) y semilla con los 12 productos
- [x] 4.4 B1 · Productos, categorías y vehículos (lectura pública)
- [x] 4.5 B4 · Login con JWT y guardia para rutas de administración
- [x] 4.6 B4 · Crear, editar, cambiar stock y borrar productos
- [x] 4.7 B2 · Cotizaciones con precio calculado en el servidor
- [x] 4.8 B3 · Eventos con límite por IP y resumen del panel
- [x] 4.9 Pruebas automáticas de los criterios B1 a B4 contra PostgreSQL
- [x] 4.10 B5 · Despliegue en Render: https://turbouniversal-api-evth.onrender.com/api (Supabase por Session pooler)
- [x] 4.11 Conectar el front a la API (`NEXT_PUBLIC_API_URL`), con respaldo a Supabase directo si la API no responde

## Calidad y operación (U5)
- [x] 5.1 Reglas de negocio de F1–F3 en `lib/reglas.ts` y pruebas unitarias (`tests/unit`)
- [x] 5.2 Pruebas e2e de F1–F3 con Playwright (`tests/e2e`), incluida la regla crítica
- [x] 5.3 Pruebas de acceso cruzado en el front (panel) y en la API (tokens falsos, vencidos, sin rol)
- [x] 5.4 CI en GitHub Actions (`.github/workflows/ci.yml`): front y back
- [ ] 5.5 Proteger `main` en GitHub (PR obligatorio + CI en verde)
- [x] 5.6 Auditoría propia (`docs/calidad/interventoria.md`): 14 hallazgos, 11 corregidos
- [ ] 5.7 Registrar los issues de la interventoría cruzada y sus correcciones
- [ ] 5.8 Crear Supabase `turboman-dev` con `docs/operacion/esquema-supabase.sql` y variables por entorno en Vercel
- [ ] 5.9 Redirect URLs en Supabase (prod y dev)
- [ ] 5.10 Evidencia de un PR → preview → producción y de un rollback (`docs/operacion/evidencias/`)
- [x] 5.11 Runbook de despliegue (`docs/operacion/despliegue.md`)
- [x] 5.12 Arquitectura desplegada con Mermaid y equivalentes AWS
- [x] 5.13 README, decisiones y bitácora (métricas y riesgos) al día
- [ ] 5.14 Cambiar `PANEL_CLAVE` por una clave propia en Render y Vercel (hallazgo A-04)
- [ ] 5.15 Revisar la URL de producción antes del demo day (checklist del runbook)

## Pendientes
- [ ] 3.2 Reemplazar las fotos de Nosotros que muestran logotipos de otras marcas
- [ ] 3.4 Política de tratamiento de datos (Ley 1581) publicada en el sitio (la casilla en la cotización ya está)
- [ ] 3.5 Confirmar con la empresa el número de WhatsApp, la dirección de Medellín y teléfono y horario de Cali y Duitama
