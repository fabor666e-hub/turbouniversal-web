import Link from "next/link";
import { categorias } from "@/data/productos";
import { obtenerProductos } from "@/lib/datos";
import { NUMERO_WHATSAPP, colores, fotoCategoria } from "@/lib/utils";
import { Reveal, TarjetaProducto, TurboAnimado } from "./components/Comunes";
import BuscadorHero from "./components/BuscadorHero";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const productos = await obtenerProductos();
  const destacados = productos.filter((p) => p.stock > 0).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#1a2150] via-[#1a2150] to-[#2a3580] px-6 pb-32 pt-16 text-white"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="flotar pointer-events-none absolute -right-10 top-8 hidden opacity-30 md:block">
          <TurboAnimado />
        </div>
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">
            Turboalimentadores con calidad de equipo original
          </p>
          <h1 className="text-4xl font-extrabold md:text-6xl">
            Encuentra tu turbo en segundos
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Busca por referencia, marca o vehículo
          </p>
          <BuscadorHero />
        </Reveal>
      </section>

      {/* Ventajas */}
      <section className="mx-auto max-w-6xl px-8 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icono: "✅", titulo: "Calidad de equipo original", texto: "Turboalimentadores Turboman, marca registrada en Colombia." },
            { icono: "📋", titulo: "Cotización en línea", texto: "Arma tu lista y envíala a un asesor por WhatsApp." },
            { icono: "📦", titulo: "Disponibilidad a la vista", texto: "Consulta cuántas unidades hay de cada producto." },
          ].map((v, i) => (
            <Reveal key={v.titulo} delay={i * 100}>
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-3xl">{v.icono}</span>
                <h3 className="mt-3 font-bold text-[#1a2150]">{v.titulo}</h3>
                <p className="mt-1 text-sm text-slate-500">{v.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categorías (llevan al catálogo) */}
      <section className="mx-auto max-w-6xl px-8 py-10">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-[#1a2150]">
            ¿Qué necesitas?
            <span className="mt-2 block h-1 w-16 rounded-full bg-[#e8233b]" />
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((c, i) => {
            const foto = fotoCategoria(c.slug);
            return (
              <Reveal key={c.slug} delay={i * 70}>
                <Link
                  href={`/productos?cat=${c.slug}`}
                  className="block h-full rounded-2xl rounded-br-[3rem] bg-white p-6 text-[#1a2150] shadow transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto} alt={c.nombre} className="mb-3 h-20 w-auto object-contain" />
                  ) : (
                    <span
                      className="mb-3 block h-1.5 w-10 rounded-full"
                      style={{ backgroundColor: colores[c.slug] }}
                    />
                  )}
                  <span className="block text-lg font-semibold">{c.nombre}</span>
                  <span className="text-sm text-slate-400">Ver productos →</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-8 py-10">
        <Reveal>
          <h2 className="mb-6 text-2xl font-bold text-[#1a2150]">
            Productos destacados
            <span className="mt-2 block h-1 w-16 rounded-full bg-[#e8233b]" />
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((p, i) => (
            <Reveal key={p.referencia} delay={i * 80}>
              <TarjetaProducto p={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/productos"
            className="inline-block rounded-full bg-[#1a2150] px-8 py-3 font-semibold text-white transition hover:bg-[#e8233b]"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="mx-auto max-w-6xl px-8 py-10">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl rounded-br-[5rem] bg-[#e8233b] p-10 text-white md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">¿No encuentras tu turbo?</h2>
              <p className="mt-2 text-white/80">
                Escríbenos con la referencia o el vehículo y te ayudamos a encontrarlo.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Hola, estoy buscando un turbo.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 font-semibold text-[#e8233b] transition hover:scale-105"
              >
                Escribir por WhatsApp
              </a>
              <Link
                href="/nosotros"
                className="rounded-full border-2 border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-[#e8233b]"
              >
                Conócenos
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}