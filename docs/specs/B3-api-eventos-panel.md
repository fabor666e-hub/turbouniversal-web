# B3 · API de eventos y panel

## Historia
Como **administrador**, quiero que la API registre lo que hacen los visitantes y me entregue un resumen, para decidir qué comprar y qué promocionar.

## Comportamiento
1. El front envía eventos (`POST /api/eventos`) sin bloquear al usuario.
2. El panel pide `GET /api/panel/resumen` con su token.

## Criterios de aceptación
- [x] `POST /api/eventos` con un tipo válido responde 202.
- [x] Un tipo que no está en la lista responde 400.
- [x] Un `detalle` de más de 120 caracteres responde 400.
- [x] Más de 60 eventos en un minuto desde la misma IP responde 429.
- [x] `GET /api/panel/resumen` sin token responde 401.
- [x] Con token, el resumen trae los totales y las listas del contrato, incluidos los vehículos del asistente.
- [x] `stockBajo` incluye solo productos con 3 unidades o menos.

Verificado con las pruebas automáticas de `backend/test/api.e2e-spec.ts` (32 pruebas) contra PostgreSQL.

## Fuera de alcance
Gráficas, exportar a Excel, filtros por fecha (fase 2).
