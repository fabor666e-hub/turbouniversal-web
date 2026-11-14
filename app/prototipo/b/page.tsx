// Variante B · Catálogo visual: el hero lleva directo a categorías y productos.
import Link from "next/link";
import { categorias } from "@/data/productos";
import { obtenerProductos } from "@/lib/datos";
import { colores } from "@/lib/utils";
import { TarjetaProducto, TurboAnimado } from "../../components/Comunes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prototipo B | Turbo Universal" };

export default async function VarianteB() {
  const productos = await obtenerProductos();

  return (
    <main>
      <section className="bg-[#1a2150] px-6 py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#ff6b7d]">
              Distribuidores oficiales Turboman y Master Power
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Turbos y repuestos con calidad de equipo original
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Revisa la disponibilidad y arma tu cotización en minutos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/productos" className="rounded-full bg-[#e8233b] px-7 py-3 font-semibold transition hover:brightness-90">
                Ver catálogo
              </Link>
              <Link href="/asistente" className="rounded-full border-2 border-white px-7 py-3 font-semibold transition hover:bg-white hover:text-[#1a2150]">
                Buscar por vehículo
              </Link>
            </div>
          </div>
          <div className="flotar mx-auto flex h-72 w-72 items-center justify-center rounded-full bg-[#e8233b]/20">
            <TurboAnimado />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categorias.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?cat=${c.slug}`}
              className="shrink-0 rounded-full border-2 px-5 py-2 text-sm font-semibold transition hover:text-white"
              style={{ borderColor: colores[c.slug], color: colores[c.slug] }}
            >
              {c.nombre}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#1a2150]">Disponibles hoy</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productos.slice(0, 8).map((p) => (
            <TarjetaProducto key={p.referencia} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
