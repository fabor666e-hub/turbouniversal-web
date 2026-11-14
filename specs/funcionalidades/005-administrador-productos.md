# 005 – Administrador de productos

**Estado:** Borrador
**Prioridad:** Alta

## Problema
Hoy, para cambiar un precio o el stock, hay que entrar a Supabase. La empresa necesita hacerlo sola, rápido y sin riesgo.

## Historias de usuario
- Como **administrador**, quiero ver la lista de productos y buscar en ella.
- Como **administrador**, quiero crear un producto nuevo con todos sus datos.
- Como **administrador**, quiero editar precio, stock y vehículos de un producto.
- Como **administrador**, quiero cambiar el stock rápido con botones + y −.
- Como **administrador**, quiero borrar un producto, con confirmación.

## Criterios de aceptación
- [ ] Sección "Productos" dentro de `/panel`, protegida por la misma sesión.
- [ ] Tabla con referencia, nombre, marca, categoría, precio, stock y buscador.
- [ ] Formulario de creación y edición con validaciones: referencia única y obligatoria; precio y stock enteros ≥ 0; categoría de la lista; vehículos uno por línea, en formato "Marca Modelo".
- [ ] Los cambios se ven en el sitio público en la siguiente visita.
- [ ] Borrar pide confirmación y muestra la referencia que se va a borrar.
- [ ] Mensajes de éxito o error en español después de cada acción.
- [ ] Ninguna escritura usa la clave pública: todas pasan por acciones de servidor con `supabaseAdmin` y verifican la cookie del panel.

## Fuera de alcance
- Subir fotos (se hará en otra funcionalidad).
- Carga masiva desde Excel.
- Historial de cambios.

## Dudas
- [DUDA] ¿Cuántas personas de la empresa usarán el panel? ¿Necesitan usuarios separados?
- [DUDA] ¿Los precios llevan IVA incluido?

## Plan técnico
- **Archivos nuevos:** `app/panel/productos/page.tsx` (lista), `app/panel/productos/[referencia]/page.tsx` (editar), `app/panel/productos/nuevo/page.tsx`, `app/panel/acciones.ts` (acciones de servidor), `app/panel/sesion.ts` (verificar cookie).
- **Archivos que cambian:** `app/panel/page.tsx` (enlace a Productos).
- **Datos:** tabla `productos` existente; las escrituras van con `service_role` en el servidor, así que no se abren políticas RLS de escritura al público.
- **Riesgos:** si se olvida verificar la cookie en una acción, cualquiera podría modificar productos. Toda acción debe empezar verificando la sesión.
- **Cumple la constitución:** sí (sin librerías nuevas, clave secreta solo en el servidor).

## Tareas
- [ ] Crear `sesion.ts` con `verificarSesion()` reutilizable y usarla en el panel actual.
- [ ] Lista de productos con buscador.
- [ ] Acción `crearProducto` con validaciones y formulario "Nuevo".
- [ ] Acción `editarProducto` y página de edición.
- [ ] Botones + y − de stock (acción `cambiarStock`).
- [ ] Acción `borrarProducto` con confirmación.
- [ ] Probar cada criterio de aceptación y `npm run build`.
