# F3 · Asistente por vehículo

## Historia
Como **dueño de vehículo** que no conoce la referencia, quiero elegir la marca y el modelo de mi carro para ver los turbos que le sirven.

## Comportamiento
1. Desde el menú o el botón del inicio, abre `/asistente`.
2. Paso 1: elige la marca. Paso 2: el modelo. Paso 3: el tipo de repuesto o "Ver todos".
3. Ve los productos compatibles con stock y botón de cotizar, o un botón de WhatsApp si no hay.

## Criterios de aceptación
- [x] El menú y el inicio tienen un enlace al asistente.
- [x] Las marcas del paso 1 salen de los vehículos de los productos (ej. Chevrolet, Renault).
- [x] Elegir Chevrolet → NPR → Ver todos muestra solo productos compatibles con Chevrolet NPR.
- [x] La barra de progreso avanza en cada paso.
- [x] "Atrás" vuelve al paso anterior y "Empezar de nuevo" vuelve al paso 1.
- [x] Si no hay resultados, aparece un mensaje y un botón de WhatsApp con el vehículo escrito.
- [x] Cada elección queda registrada como evento `asistente`.

## Fuera de alcance
Año del vehículo y tipo de combustible (los datos aún no los tienen).
