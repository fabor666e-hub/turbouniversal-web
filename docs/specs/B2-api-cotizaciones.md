# B2 · API de cotizaciones

## Historia
Como **cliente**, quiero que mi cotización quede guardada con precios correctos, para que el asesor la reciba completa y confiable.

## Comportamiento
1. El front envía nombre, teléfono, aceptación de datos y las referencias con cantidades.
2. La API valida, busca cada producto, toma su precio real y calcula el total.
3. La guarda y la devuelve; el front abre WhatsApp con ese resumen.

## Criterios de aceptación
- [x] Una cotización válida responde 201 con `id`, ítems con nombre y precio de la base de datos y `total` correcto.
- [x] Si el cuerpo trae un precio inventado, se ignora: el total usa el precio de la base de datos.
- [x] Sin `aceptaDatos: true` responde 400 `VALIDACION`.
- [x] Un teléfono con letras o de menos de 7 dígitos responde 400.
- [x] Una referencia inexistente responde 404 `NO_ENCONTRADO`.
- [x] Pedir más unidades que el stock responde 409 `STOCK_INSUFICIENTE`.
- [x] La cotización aparece en `GET /api/cotizaciones` (con token).

Verificado con las pruebas automáticas de `backend/test/api.e2e-spec.ts` (32 pruebas) contra PostgreSQL.

## Fuera de alcance
Descontar stock al cotizar (la venta se cierra con un asesor), pagos, envío de correos.
