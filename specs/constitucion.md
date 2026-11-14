# Constitución del proyecto

Principios no negociables. Toda especificación, plan o cambio de código debe cumplirlos.
Si alguno debe cambiar, se edita este archivo primero y se explica el motivo.

## 1. Marca
- Solo dos colores de marca: **rojo `#e8233b`** y **azul oscuro `#1a2150`** (más blanco y grises neutros). Se alternan entre categorías y secciones.
- El color de acento dinámico se maneja con la variable CSS `--acento`.
- Los botones de WhatsApp pueden usar verde, por ser el color reconocible del canal.
- Logo oficial en el encabezado de todas las páginas. Los logos de marcas (Turboman, Master Power) se usan sin deformar ni recolorear.
- No se muestran logotipos de marcas que la empresa no distribuye.

## 2. Contenido e idioma
- Todo en **español de Colombia**, con buena ortografía y tildes.
- Tono cercano y directo ("Encuentra tu turbo en segundos").
- Precios en pesos colombianos con formato `es-CO` (`$ 2.850.000`).
- Los datos de ejemplo se marcan como tales hasta reemplazarlos por los reales.

## 3. Tecnología
- Next.js (App Router) + React + TypeScript + Tailwind CSS + Supabase. Publicación en Vercel desde GitHub.
- **No se agregan librerías nuevas** si se puede resolver con lo que ya hay (Tailwind, CSS, APIs del navegador). Cualquier excepción se justifica en el plan técnico.
- Antes de usar una API de Next.js, revisar la guía en `node_modules/next/dist/docs/` (la versión instalada puede diferir de lo conocido).
- Los componentes de servidor leen datos; los de cliente (`"use client"`) manejan la interacción.
- Si Supabase no responde, el sitio sigue funcionando con los datos locales de `data/productos.ts`.

## 4. Seguridad y datos personales
- La clave `service_role` de Supabase **solo** se usa en el servidor (`lib/supabaseAdmin.ts`) y nunca lleva el prefijo `NEXT_PUBLIC_`.
- `.env.local` nunca se sube a GitHub.
- Políticas RLS: el visitante **solo lee** productos e **inserta** eventos y cotizaciones; no puede leer eventos ni cotizaciones.
- Se cumple la Ley 1581 de 2012: los datos personales (nombre, teléfono) se piden solo para responder la cotización, y se informa al usuario.
- El panel `/panel` requiere autenticación y no se indexa en buscadores.

## 5. Experiencia de usuario
- Diseño **responsive**, pensado primero para celular.
- Animaciones suaves y con propósito (aparecer al hacer scroll, cambio de color, turbo girando); nunca bloquean el uso.
- Todo clic debe dar respuesta inmediata (pantalla de carga, estados deshabilitados).
- Accesibilidad básica: textos alternativos en imágenes, `aria-label` en botones solo con icono, contraste suficiente.

## 6. Calidad
- Cada funcionalidad tiene su especificación en `specs/funcionalidades/` antes de programarse.
- Cada criterio de aceptación se prueba manualmente en `npm run dev` y, antes de publicar, con `npm run build`.
- Los nombres de carpetas de rutas van en minúscula (Vercel distingue mayúsculas).
