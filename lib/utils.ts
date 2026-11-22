import { categorias, type Producto } from "@/data/productos";

// El número de WhatsApp ahora se cambia SOLO aquí
export const NUMERO_WHATSAPP = "573138275485";
export const LINK_CATALOGO =
    
  "https://www.flipsnack.com/turbiouniversal/turbo-alimentadores.html";

// Colores de la marca
export const INSTAGRAM = "https://www.instagram.com/turbosturboman";
export const FACEBOOK = "https://www.facebook.com/share/19fudNfqaE/";
export const ROJO = "#e8233b";
export const AZUL = "#1a2150";

// Color de cada categoría (alterna entre los dos de la marca)
export const colores: Record<string, string> = {
  turboalimentadores: ROJO,
  cartridge: AZUL,
  "kit-reparacion": ROJO,
  "conjunto-rotor": AZUL,
  "actuador-electronico": ROJO,
  "geometria-variable": AZUL,
  "caracol-admision": ROJO,
  "caracol-escape": AZUL,
};

export const normalizar = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// null = el producto no tiene precio publicado
export const precio = (n: number | null) =>
  n === null
    ? "Precio a consultar"
    : new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(n);

// Foto de la categoría (si tiene)
export const fotoCategoria = (slug: string): string | undefined =>
  (categorias.find((c) => c.slug === slug) as unknown as { imagen?: string } | undefined)
    ?.imagen;

// Foto del producto; si no tiene, la de su categoría
export const fotoDe = (p: Producto): string | undefined =>
  (p as unknown as { imagen?: string }).imagen ?? fotoCategoria(p.categoria);

// Dirección pública del sitio (enlaces absolutos: sitemap, Google, compartir)
export const SITIO = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://turbouniversal-web.vercel.app").replace(/\/+$/, "");
