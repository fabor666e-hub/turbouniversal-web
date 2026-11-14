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
| WhatsApp | Verde | `#16a34a` |
| Estados de stock | Verde / Ámbar / Rojo | Disponible / Pocas unidades / Agotado |

Solo se usan el rojo y el azul como colores de marca; se alternan entre categorías y el acento dinámico (`--acento`) cambia con transición suave.

### Contraste (WCAG AA, mínimo 4.5:1 para texto normal)
| Combinación | Contraste | Resultado |
|---|---|---|
| Blanco sobre azul `#1a2150` | 15.25:1 | Cumple |
| Azul `#1a2150` sobre fondo `#f8fafc` | 14.57:1 | Cumple |
| Slate 500 sobre blanco | 4.76:1 | Cumple |
| Blanco sobre rojo `#e8233b` | 4.44:1 | Cumple solo para texto grande o negrita ≥ 18,7 px. **Pendiente:** usar `#d91e34` (5.02:1) en botones con texto pequeño. |
| Blanco sobre verde `#16a34a` | 3.30:1 | **Pendiente:** usar `#15803d` (5.02:1) en botones de WhatsApp. |

## Tipografía
Geist (Google Fonts, cargada con `next/font`). Títulos en 700–800 (`font-bold`, `font-extrabold`), texto en 400, etiquetas en mayúsculas con `tracking-widest`.

## Estilo de componentes
- Tarjetas blancas con bordes redondeados (`rounded-2xl`) y una esquina inferior derecha más curva (`rounded-br-[3rem]` a `[6rem]`) como sello de la marca.
- Hero azul con degradado y corte diagonal inferior (`clipPath`), que da sensación de velocidad.
- Botones en forma de píldora (`rounded-full`); primario rojo, secundario con borde azul.
- Sombras suaves que crecen al pasar el mouse y tarjetas que se elevan (`hover:-translate-y-2`).
- Movimiento con propósito: turbo animado que gira y flota, tarjetas que aparecen al hacer scroll, cambio de color de acento.
- Mobile first: se diseña a 390 px y se amplía con `sm:`, `md:` y `lg:`.

## Logos
- Turbo Universal: `public/logo.png` (encabezado).
- Turboman y Master Power: `public/marcas/` (solo en la página Marcas, sin deformar ni recolorear).
- No se muestran logotipos de marcas que la empresa no distribuye.

## Referencia
- Pantalla principal elegida (variante A): `docs/diseno/referencias/pantalla-principal-escritorio.png` y `pantalla-principal-celular.png`.
- Variantes descartadas: `variante-b-*.png`, `variante-c-*.png`. Comparación en docs/decisiones.md.
