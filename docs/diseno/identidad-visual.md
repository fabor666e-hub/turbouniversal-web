# Identidad visual · Turbo Universal

## Tono
Cercano, directo y confiable. Frases cortas, tutea al cliente, español de Colombia con buena ortografía.
Ejemplos: "Encuentra tu turbo en segundos", "Arma tu cotización en línea", "Esta página se quedó sin turbo".

## Paleta
| Uso | Color | HEX |
|---|---|---|
| Primario (acciones, precios, acentos) | Rojo Turbo | `#e8233b` |
| Secundario (encabezados, fondos de hero, texto fuerte) | Azul Turbo | `#1a2150` |
| Azul claro (degradados) | | `#2a3580` |
| Fondo de página | Slate 50 | `#f8fafc` |
| Tarjetas | Blanco | `#ffffff` |
| Texto | Slate 800 | `#1e293b` |
| Texto secundario | Slate 500 | `#64748b` |
| WhatsApp | Verde | `#15803d` (botones) |
| Estados de stock | Verde / Ámbar / Rojo | Disponible / Pocas unidades / Agotado |

Solo se usan el rojo y el azul como colores de marca; se alternan entre categorías y el acento dinámico (`--acento`) cambia con transición suave.

### Contraste (WCAG AA, mínimo 4.5:1 para texto normal)
| Combinación | Contraste | Resultado |
|---|---|---|
| Blanco sobre azul `#1a2150` | 15.25:1 | Cumple |
| Azul `#1a2150` sobre fondo `#f8fafc` | 14.57:1 | Cumple |
| Slate 500 sobre blanco | 4.76:1 | Cumple |
| Blanco sobre rojo `#e8233b` | 4.44:1 | Cumple solo para texto grande. **Corregido (nov. 2026):** todo botón o insignia con texto blanco usa `#d91e34` (5.02:1); `#e8233b` queda para acentos sin texto. |
| Blanco sobre verde `#16a34a` | 3.30:1 | **Corregido (nov. 2026):** los botones de WhatsApp usan `#15803d` (green-700, 5.02:1) y `#166534` al pasar el mouse. |

## Tipografía
Geist (Google Fonts, cargada con `next/font`). Títulos en 700–800 (`font-bold`, `font-extrabold`), texto en 400, etiquetas en mayúsculas con `tracking-widest`.

## Estilo de componentes (línea corporativa, nov. 2026)
- Tono visual sobrio e industrial: azul de marca con una cuadrícula técnica sutil (`.fondo-marca` en `globals.css`) y una franja roja de 4 px como cierre de los encabezados.
- Bordes rectos y radios pequeños: tarjetas `rounded-lg` con borde `slate-200`, botones `rounded-md`. Sin esquinas exageradas ni formas de píldora.
- Botón primario rojo `#d91e34` (cumple AA con texto blanco); secundario con borde azul.
- Títulos de sección con etiqueta pequeña en mayúsculas roja y título azul `font-bold tracking-tight`, separados por una línea gris.
- Barra superior azul oscuro `#11173a` con WhatsApp y horario; menú blanco con subrayado rojo en la página activa.
- Movimiento discreto: aparición suave al hacer scroll (3 px, 500 ms) y sombra al pasar el mouse. Sin rebotes, escalados, pulsos ni giros.
- Referencias de producto en fuente monoespaciada, como en un catálogo técnico.
- Mobile first: se diseña a 390 px y se amplía con `sm:`, `md:` y `lg:`.

## Íconos
- Íconos SVG de trazo redondeado en `app/components/Iconos.tsx` (buscar, escudo, lista, caja, ubicación, teléfono, correo, reloj, WhatsApp, turbo). Heredan el color con `currentColor`; no se usan emojis como íconos.
- Ícono de la pestaña: rueda de turbo blanca con centro rojo sobre círculo azul (`app/favicon.ico`, `app/apple-icon.png`).
- Imagen para compartir el enlace: `app/opengraph-image.png` (1200 × 630).

## Logos
- Turbo Universal: `public/logo.png` (encabezado).
- Turboman y Master Power: `public/marcas/` (solo en la página Marcas, sin deformar ni recolorear).
- No se muestran logotipos de marcas que la empresa no distribuye.

## Referencia
- Pantalla principal elegida (variante A): `docs/diseno/referencias/pantalla-principal-escritorio.png` y `pantalla-principal-celular.png`.
- Variantes descartadas: `variante-b-*.png`, `variante-c-*.png`. Comparación en docs/decisiones.md.
