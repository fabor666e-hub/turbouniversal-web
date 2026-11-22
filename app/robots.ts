import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/utils";

// /robots.txt: Google puede leer todo el sitio público, pero no el panel ni los prototipos.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/prototipo"] },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
