import Link from "next/link";
import { NUMERO_WHATSAPP } from "@/lib/utils";

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

// Si la marca tiene productos en el catálogo, el clic los muestra.
// Si no, abre WhatsApp con un mensaje listo: así nunca se llega a una búsqueda vacía.
function destino(marca: string, conProductos: string[]) {
  if (conProductos.includes(marca)) return `/productos?q=${encodeURIComponent(marca)}`;
  const texto = `Hola, busco un turbo o repuesto para ${marca}. Mi vehículo es: `;
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

function Fila({ oculta = false, conProductos }: { oculta?: boolean; conProductos: string[] }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {MARCAS.map((m) => {
        const enCatalogo = conProductos.includes(m);
        const href = destino(m, conProductos);
        return (
        <li key={m} className="flex items-center">
          <Link
            href={href}
            {...(enCatalogo ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            title={enCatalogo ? `Ver referencias para ${m}` : `Pregunta por ${m} a un asesor por WhatsApp`}
            tabIndex={oculta ? -1 : undefined}
            data-track={`barra-marca-${m.toLowerCase()}${enCatalogo ? "" : "-whatsapp"}`}
            className="px-8 text-xl font-bold uppercase tracking-wider text-slate-400 transition hover:text-[#1a2150] md:text-2xl"
          >
            {m}
          </Link>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8233b]" aria-hidden="true" />
        </li>
        );
      })}
    </ul>
  );
}

// conProductos: marcas de vehículo que aparecen en el catálogo (las calcula la página de inicio)
export default function BarraMarcas({ conProductos }: { conProductos: string[] }) {
  return (
    <section className="border-b border-slate-200 bg-white py-10" aria-labelledby="titulo-referencias">
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-end justify-between gap-2 px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#e8233b]">Todas las referencias</p>
          <h2 id="titulo-referencias" className="mt-1 text-xl font-bold tracking-tight text-[#1a2150] md:text-2xl">
            Turbos para las principales marcas
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Toca una marca: si no está en el catálogo en línea, te la cotizamos por WhatsApp.
        </p>
      </div>

      {/* Barra que se desliza sola; se detiene al pasar el mouse */}
      <div className="barra-marcas relative overflow-hidden">
        <div className="barra-marcas-pista flex w-max">
          <Fila conProductos={conProductos} />
          <Fila oculta conProductos={conProductos} />
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
