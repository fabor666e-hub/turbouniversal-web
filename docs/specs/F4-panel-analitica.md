# F4 · Panel de analítica

## Historia
Como **administrador de la empresa**, quiero ver qué buscan, miran y cotizan los clientes y qué productos tienen poco stock, para decidir qué comprar.

## Comportamiento
1. Entra a `/panel` y escribe la contraseña.
2. Ve totales, listas con barras y las últimas cotizaciones.

## Criterios de aceptación
- [x] Sin contraseña, `/panel` solo muestra el formulario de acceso.
- [x] Con una contraseña incorrecta no se entra.
- [x] Con la contraseña correcta se ven: vistas, búsquedas, agregados a cotización y cotizaciones enviadas.
- [x] Se ven las listas de productos más vistos, más buscados, categorías, clics por botón y stock bajo (3 o menos).
- [x] Se ve la tabla de últimas cotizaciones con fecha, cliente, teléfono, productos y total.
- [x] "Salir" cierra la sesión.
- [x] La página no aparece en Google (`noindex`).

## Fuera de alcance
Filtro por fechas, usuarios separados con Supabase Auth, gráficas avanzadas.
