# 003 – Asistente por vehículo

**Estado:** Implementado
**Prioridad:** Media

## Problema
Muchos clientes no conocen la referencia del turbo; solo saben qué carro tienen.

## Historias de usuario
- Como **dueño de vehículo**, quiero elegir marca y modelo de mi carro para ver los turbos compatibles.
- Como **empresa**, quiero saber qué vehículos consultan más.

## Criterios de aceptación
- [x] Página `/asistente`, enlazada desde el menú y el inicio.
- [x] Paso 1: marcas; paso 2: modelos; paso 3: tipo de repuesto (o "Ver todos").
- [x] Las opciones salen del campo `vehiculos` de los productos (formato "Marca Modelo"), no se escriben a mano.
- [x] El resultado usa la misma tarjeta de producto, con stock y botón de cotizar.
- [x] Sin resultados: mensaje amable y botón de WhatsApp con el vehículo escrito.
- [x] Barra de progreso, botón Atrás y Empezar de nuevo.
- [x] Cada elección se registra como evento `asistente`.

## Pendiente
- [ ] Mostrar las elecciones del asistente en el panel.
- [ ] [DUDA] Agregar año y tipo de combustible cuando los datos reales lo incluyan.
