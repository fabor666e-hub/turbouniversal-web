---
name: ui-componentes
description: Crear o modificar componentes y pantallas de la interfaz de Turbo Universal respetando la identidad visual. Úsala cada vez que la tarea toque la UI.
---

# Cómo construimos UI en Turbo Universal

1. Lee `docs/diseno/identidad-visual.md` antes de escribir estilos.
2. Colores de marca: solo rojo `#e8233b` y azul `#1a2150` (más blanco y grises slate). Para el acento dinámico usa `var(--acento)`. El verde solo para WhatsApp.
3. Componentes en `app/components/`, uno por responsabilidad, en PascalCase, con props tipadas en TypeScript. Agrega `"use client"` solo si el componente usa estado, efectos o eventos.
4. Reutiliza lo que ya existe antes de crear algo nuevo:
   - `Reveal` (aparecer al hacer scroll), `TarjetaProducto`, `EtiquetaStock`, `TurboAnimado` en `Comunes.tsx`.
   - `usarCotizacion()` para la cotización; `registrar(tipo, detalle)` para medir; `precio()` y `normalizar()` de `lib/utils.ts`.
5. Estilo de la marca: tarjetas `rounded-2xl` con esquina `rounded-br-[3rem]`, botones `rounded-full`, hero azul con corte diagonal, sombras que crecen en hover.
6. Mobile first: diseña a 390 px y amplía con `sm:`, `md:` y `lg:`. Sin desplazamiento horizontal.
7. Accesibilidad mínima:
   - Botones con texto claro y área táctil de 44 px.
   - Imágenes con `alt`; inputs con `label` o `aria-label`; botones solo con ícono con `aria-label`.
   - Texto blanco sobre rojo solo en negrita y tamaño grande; para texto pequeño usa `#d91e34`.
8. Estados: muestra siempre cargando, vacío y error (en español).
9. Textos en español de Colombia, con tildes, tono cercano y directo.
10. Marca con `data-track="nombre"` los botones importantes para que aparezcan en el panel.
11. Al terminar, lista los componentes creados o cambiados y cómo verlos en el navegador.
