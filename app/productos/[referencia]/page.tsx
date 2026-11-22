import Link from "next/link";
import { notFound } from "next/navigation";
import { categorias } from "@/data/productos";
import { obtenerProducto } from "@/lib/datos";
import { NUMERO_WHATSAPP, SITIO, fotoDe, precio } from "@/lib/utils";
import { datosEstructurados, mensajeCompartir } from "@/lib/reglas";
import { IconoTurbo } from "../../components/Iconos";
import RegistrarVista from "../../components/RegistrarVista";
import { BotonAgregar } from "../../components/Comunes";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const p = await obtenerProducto(referencia);
  if (!p) return { title: "Producto no encontrado" };
  return {
    title: `${p.nombre} | Turbo Universal`,
    description: `${p.nombre}, referencia ${p.referencia}. Compatible con ${p.vehiculos.join(", ")}. Cotiza en Turbo Universal.`,
    alternates: { canonical: `/productos/${encodeURIComponent(p.referencia)}` },
    openGraph: {
      title: `${p.nombre} · Ref. ${p.referencia}`,
      description: `Compatible con ${p.vehiculos.join(", ")}. Cotiza en Turbo Universal.`,
      url: `/productos/${encodeURIComponent(p.referencia)}`,
    },
  };
}

export default async function PaginaProducto({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const p = await obtenerProducto(referencia);
  if (!p) notFound();

  const categoria = categorias.find((c) => c.slug === p.categoria);
  const foto = fotoDe(p);
  const mensaje =
    p.stock === 0
      ? `Hola, ¿cuándo llega ${p.nombre} (Ref. ${p.referencia})?`
      : `Hola, quiero cotizar: ${p.nombre} (Ref. ${p.referencia}).`;
  const linkWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  const url = `${SITIO}/productos/${encodeURIComponent(p.referencia)}`;
  // Sin número: WhatsApp deja elegir a quién mandarlo (por ejemplo, el mecánico a su cliente)
  const linkCompartir = `https://wa.me/?text=${encodeURIComponent(mensajeCompartir(p, url))}`;
  const jsonLd = datosEstructurados(p, url, foto ? new URL(foto, SITIO).toString() : undefined);

  const estado =
    p.stock === 0
      ? { texto: "Agotado", clases: "bg-red-100 text-red-700" }
      : p.stock <= 3
      ? { texto: `Pocas unidades (${p.stock})`, clases: "bg-amber-100 text-amber-700" }
      : { texto: `Disponible (${p.stock} unidades)`, clases: "bg-green-100 text-green-700" };

  return (
    <main className="mx-auto max-w-5xl px-8 py-12">
      <RegistrarVista referencia={p.referencia} />
      {/* Datos para Google: nombre, referencia, marca, precio y disponibilidad */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <p className="mb-6 text-sm text-slate-400">
        <Link href="/productos" className="hover:text-[#e8233b]">← Volver al catálogo</Link>
        {" · "}
        {categoria?.nombre} / {p.referencia}
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt={p.nombre} className="h-full w-full object-contain p-6" />
          ) : (
            <div className="text-center text-slate-300">
              <IconoTurbo className="mx-auto h-24 w-24 text-slate-300" />
              <p className="mt-3 text-sm">Foto próximamente</p>
            </div>
          )}
        </div>

        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.clases}`}>
            {estado.texto}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#1a2150]">{p.nombre}</h1>
          <p className="mt-1 text-slate-400">Referencia {p.referencia}</p>

          <p className="mt-6 text-4xl font-bold text-[#e8233b]">{precio(p.precio)}</p>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-32 font-semibold text-[#1a2150]">Marca</dt>
              <dd>{p.marca}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 font-semibold text-[#1a2150]">Categoría</dt>
              <dd>{categoria?.nombre}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 font-semibold text-[#1a2150]">Compatible con</dt>
              <dd>{p.vehiculos.join(" · ")}</dd>
            </div>
            {p.oem && p.oem.length > 0 && (
              <div className="flex gap-3">
                <dt className="w-32 shrink-0 font-semibold text-[#1a2150]">Números OEM</dt>
                <dd className="font-mono">{p.oem.join(" · ")}</dd>
              </div>
            )}
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 font-semibold text-[#1a2150]">Garantía</dt>
              <dd>{p.garantia ?? "Consúltala con un asesor"}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <BotonAgregar p={p} grande />
          </div>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            data-track="ficha-whatsapp"
            className="mt-3 block rounded-md bg-green-700 py-3 text-center font-semibold text-white transition hover:bg-green-800"
          >
            {p.stock === 0 ? "Preguntar por WhatsApp cuándo llega" : "Cotizar solo este por WhatsApp"}
          </a>
          <a
            href={linkCompartir}
            target="_blank"
            rel="noopener noreferrer"
            data-track="compartir-producto"
            className="mt-3 block rounded-md border-2 border-[#1a2150] py-3 text-center font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
          >
            Compartir este producto
          </a>
          <p className="mt-3 text-center text-xs text-slate-400">
            Precio de ejemplo. La disponibilidad final se confirma con un asesor.
          </p>
        </div>
      </div>
    </main>
  );
}