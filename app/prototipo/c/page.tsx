// Variante C · Por vehículo: la acción principal es elegir la marca del carro.
import Link from "next/link";
import { obtenerProductos } from "@/lib/datos";
import { TarjetaProducto } from "../../components/Comunes";
import BuscadorHero from "../../components/BuscadorHero";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prototipo C | Turbo Universal" };

export default async function VarianteC() {
  const productos = await obtenerProductos();
  const marcasVehiculo = [
    ...new Set(productos.flatMap((p) => p.vehiculos.map((v) => v.trim().split(" ")[0]))),
  ].sort();

  return (
    <main>
      <section className="bg-white px-6 py-12 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-[#1a2150] md:text-5xl">
            ¿Qué vehículo tienes?
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Elige la marca y te mostramos el turbo que le sirve.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {marcasVehiculo.map((m, i) => (
              <Link
                key={m}
                href="/asistente"
                className={`rounded-2xl border-2 bg-white px-4 py-5 font-bold text-[#1a2150] shadow-sm transition hover:-translate-y-1 hover:bg-[#1a2150] hover:text-white ${
                  i % 2 === 0 ? "border-[#e8233b]" : "border-[#1a2150]"
                }`}
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a2150] px-6 pb-12 pt-6 text-center text-white">
        <p className="mt-4 text-white/70">¿Ya conoces la referencia?</p>
        <div className="mx-auto max-w-3xl">
          <BuscadorHero />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-[#1a2150]">Más consultados</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productos.filter((p) => p.stock === null || p.stock > 0).slice(0, 4).map((p) => (
            <TarjetaProducto key={p.referencia} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
