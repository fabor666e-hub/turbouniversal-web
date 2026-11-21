import Link from "next/link";

// Marcas de vehículos para las que hay referencias (las mismas de turbouniversal.com.co
// más las que aparecen en el catálogo). Para agregar una, escríbela en la lista.
// Si luego se guardan logos en public/vehiculos/, se pueden mostrar en lugar del nombre.
const MARCAS = [
  "Nissan",
  "Toyota",
  "Ford",
  "Mazda",
  "Peugeot",
  "Renault",
  "Suzuki",
  "BMW",
  "Chevrolet",
  "Kenworth",
  "Caterpillar",
];

function Fila({ oculta = false }: { oculta?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {MARCAS.map((m) => (
        <li key={m} className="flex items-center">
          <Link
            href={`/productos?q=${encodeURIComponent(m)}`}
            tabIndex={oculta ? -1 : undefined}
            data-track={`barra-marca-${m.toLowerCase()}`}
            className="px-8 text-xl font-bold uppercase tracking-wider text-slate-400 transition hover:text-[#1a2150] md:text-2xl"
          >
            {m}
          </Link>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8233b]" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export default function BarraMarcas() {
  return (
    <section className="border-b border-slate-200 bg-white py-10" aria-labelledby="titulo-referencias">
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-end justify-between gap-2 px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#e8233b]">Todas las referencias</p>
          <h2 id="titulo-referencias" className="mt-1 text-xl font-bold tracking-tight text-[#1a2150] md:text-2xl">
            Turbos para las principales marcas
          </h2>
        </div>
        <p className="text-sm text-slate-500">Si no la ves, te ayudamos a encontrarla.</p>
      </div>

      {/* Barra que se desliza sola; se detiene al pasar el mouse */}
      <div className="barra-marcas relative overflow-hidden">
        <div className="barra-marcas-pista flex w-max">
          <Fila />
          <Fila oculta />
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
