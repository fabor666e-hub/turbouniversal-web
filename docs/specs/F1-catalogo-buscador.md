# F1 · Catálogo y buscador

## Historia
Como **mecánico o dueño de vehículo**, quiero buscar un repuesto por referencia, marca o vehículo y ver si hay unidades, para saber rápido si Turbo Universal lo tiene.

## Comportamiento
1. En el inicio, el cliente escribe en el buscador (ej. "NPR") o toca una sugerencia.
2. Llega a `/productos` con los resultados filtrados; puede filtrar por categoría.
3. Cada tarjeta muestra foto o ícono, referencia, nombre, vehículos, precio y estado de stock.
4. Al tocar el nombre, abre la página del producto con todos sus datos.

## Criterios de aceptación
- [x] Buscar "npr" en el inicio lleva a `/productos?q=npr` y muestra solo productos que mencionan NPR.
- [x] Buscar "geometria" (sin tilde) encuentra "Geometría variable".
- [x] Tocar una categoría del inicio abre `/productos?cat=<slug>` con solo esa categoría.
- [x] Cada tarjeta muestra "Disponible", "Pocas unidades" (3 o menos) o "Agotado".
- [x] Un producto agotado tiene el botón "Agregar a cotización" deshabilitado.
- [x] `/productos/TB-1001` muestra el producto y el título de la pestaña incluye su nombre.
- [x] Una dirección que no existe (ej. `/abc`) muestra la página 404 propia con buscador.
- [x] Al cambiar de página aparece la pantalla de carga con el turbo girando.
- [x] Las páginas Nosotros, Marcas (con logos de Turboman y Master Power) y Puntos de venta (Bogotá y Medellín con mapa) abren desde el menú.
- [x] A 390 px de ancho no hay desplazamiento horizontal en el inicio ni en el catálogo.

## Fuera de alcance
Fotos reales por producto (pendiente de la empresa), sitemap y datos estructurados.
