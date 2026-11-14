# F2 · Cotización por WhatsApp

## Historia
Como **cliente**, quiero armar una lista con varios repuestos y enviarla de una vez por WhatsApp, para no escribir producto por producto.

## Comportamiento
1. El cliente toca "Agregar a cotización" en una o varias tarjetas.
2. Se abre el panel lateral "Mi cotización" con cantidades y total estimado.
3. Escribe nombre y teléfono y toca "Enviar cotización por WhatsApp".
4. Se abre WhatsApp con el mensaje armado y la cotización queda guardada.

## Criterios de aceptación
- [x] Al agregar un producto se abre el panel y el contador de "Mi cotización" sube en 1.
- [x] El botón "+" se deshabilita al llegar al stock disponible.
- [x] Con "−" en 1 unidad, el producto sale de la lista.
- [x] Al recargar la página (F5), la lista sigue igual.
- [x] El botón de enviar está deshabilitado si el nombre tiene menos de 2 letras o el teléfono menos de 7 dígitos.
- [x] Al enviar, se abre WhatsApp con cada producto (cantidad, nombre, referencia), el nombre y el teléfono.
- [x] La cotización enviada aparece en "Últimas cotizaciones" del panel.
- [x] El panel informa que los datos se usan solo para responder la cotización.

## Fuera de alcance
Pagos en línea, descuentos, cálculo de envío, casilla de política de datos (pendiente).
