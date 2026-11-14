# 002 – Cotización en línea

**Estado:** Implementado
**Prioridad:** Alta

## Problema
Cada cotización se arma a mano por WhatsApp, producto por producto.

## Historias de usuario
- Como **cliente**, quiero agregar varios productos a una lista y enviarla de una vez.
- Como **cliente**, quiero que mi lista no se pierda si recargo o cierro la página.
- Como **asesor**, quiero recibir por WhatsApp un mensaje con referencias, cantidades y datos del cliente.

## Criterios de aceptación
- [x] "Agregar a cotización" suma una unidad y abre el panel lateral.
- [x] No se pueden pedir más unidades que el stock.
- [x] El número junto a "Mi cotización" muestra el total de unidades en todas las páginas.
- [x] La lista se conserva al recargar (localStorage) y se borra al vaciarla.
- [x] El envío exige nombre (2+ caracteres) y teléfono (7+ dígitos).
- [x] Al enviar, se guarda en la tabla `cotizaciones` y se abre WhatsApp con el mensaje armado.
- [x] Se informa que los datos se usan solo para responder la cotización.

## Pendiente
- [ ] Casilla de aceptación de la política de tratamiento de datos (Ley 1581) con enlace a la política.
- [ ] [DUDA] Confirmar el número de WhatsApp oficial: el sitio usa 313 827 5485 y la página de la empresa 322 449 4190.
- [ ] Al cargar una cotización guardada, actualizar precio y stock con los datos actuales.
