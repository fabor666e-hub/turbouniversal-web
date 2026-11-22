import type { MetadataRoute } from "next";
import { obtenerProductos } from "@/lib/datos";
import { SITIO } from "@/lib/utils";

// Mapa del sitio para Google: /sitemap.xml
// Incluye las páginas públicas y una entrada por producto; se vuelve a generar cada hora.
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await obtenerProductos();
  const ahora = new Date();

  const paginas: MetadataRoute.Sitemap = [
    { url: `${SITIO}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO}/productos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITIO}/asistente`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITIO}/marcas`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITIO}/puntos-de-venta`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITIO}/nosotros`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITIO}/privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ].map((p) => ({ ...p, lastModified: ahora }) as MetadataRoute.Sitemap[number]);

  return [
    ...paginas,
    ...productos.map((p) => ({
      url: `${SITIO}/productos/${encodeURIComponent(p.referencia)}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
