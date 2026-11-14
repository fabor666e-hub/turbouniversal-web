# 004 – Panel de analítica

**Estado:** Implementado
**Prioridad:** Media

## Problema
La empresa no sabe qué buscan, miran o cotizan sus clientes, ni qué productos necesitan más stock.

## Historias de usuario
- Como **administrador**, quiero ver los productos más vistos, lo más buscado y los botones más usados.
- Como **administrador**, quiero ver las últimas cotizaciones y los productos con stock bajo.

## Criterios de aceptación
- [x] `/panel` pide contraseña (`PANEL_CLAVE`) y guarda la sesión en una cookie httpOnly de 8 horas.
- [x] Muestra totales y listas de vistas, búsquedas, clics y cotizaciones.
- [x] Muestra productos con 3 unidades o menos.
- [x] Lee los datos en el servidor con la clave secreta; no se indexa en Google.

## Pendiente
- [ ] Lista de elecciones del asistente (eventos `asistente`).
- [ ] Filtro por rango de fechas.
- [ ] Reemplazar la contraseña simple por Supabase Auth.
