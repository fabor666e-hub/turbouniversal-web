import Link from "next/link";
import { notFound } from "next/navigation";
import { categorias } from "@/data/productos";
import { obtenerProducto } from "@/lib/datos";
import { NUMERO_WHATSAPP, fotoDe, precio } from "@/lib/utils";
import RegistrarVista from "../../components/RegistrarVista";

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
  const mensaje = `Hola, quiero cotizar: ${p.nombre} (Ref. ${p.referencia}).`;
  const linkWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  const estado =
    p.stock === 0
      ? { texto: "Agotado", clases: "bg-red-100 text-red-700" }
      : p.stock <= 3
      ? { texto: `Pocas unidades (${p.stock})`, clases: "bg-amber-100 text-amber-700" }
      : { texto: `Disponible (${p.stock} unidades)`, clases: "bg-green-100 text-green-700" };

  return (
    <main className="mx-auto max-w-5xl px-8 py-12">
      <RegistrarVista referencia={p.referencia} />
      <p className="mb-6 text-sm text-slate-400">
        <Link href="/productos" className="hover:text-[#e8233b]">← Volver al catálogo</Link>
        {" · "}
        {categoria?.nombre} / {p.referencia}
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl rounded-br-[6rem] bg-white shadow-lg">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt={p.nombre} className="h-full w-full object-contain p-6" />
          ) : (
            <div className="text-center text-slate-300">
              <p className="text-6xl">⚙️</p>
              <p className="mt-3 text-sm">Foto próximamente</p>
            </div>
          )}
        </div>

        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.clases}`}>
            {estado.texto}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-[#1a2150]">{p.nombre}</h1>
          <p className="mt-1 text-slate-400">Referencia {p.referencia}</p>

          <p className="mt-6 text-4xl font-extrabold text-[#e8233b]">{precio(p.precio)}</p>

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
          </dl>

          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block rounded-full bg-green-600 py-4 text-center font-semibold text-white transition hover:bg-green-700"
          >
            Cotizar por WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-slate-400">
            Precio de ejemplo. La disponibilidad final se confirma con un asesor.
          </p>
        </div>
      </div>
    </main>
  );
}