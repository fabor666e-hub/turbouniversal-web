import Link from "next/link";
import { categorias } from "@/data/productos";
import { NUMERO_WHATSAPP } from "@/lib/utils";
import { Reveal } from "./Comunes";
import { IconoWhatsApp } from "./Iconos";

type Bloque = {
  etiqueta: string;
  titulo: string;
  texto: string;
  src: string; // foto en /public
  alt: string;
};

// EDITA estos textos. Para usar fotos reales, cambia src por la ruta de la foto en /public
const bloques: Bloque[] = [
  {
    etiqueta: "Quiénes somos",
    titulo: "Importadora Turbo Universal",
    texto:
      "Somos una empresa colombiana especializada en la comercialización y distribución de turboalimentadores y repuestos para sistemas de turbo.",
    src: "/nosotros/1-bodega.jpg",
    alt: "Bodega con turboalimentadores organizados en estanterías",
  },
  {
    etiqueta: "Turboman",
    titulo: "Calidad de equipo original",
    texto:
      "Turboman es nuestra marca registrada en Colombia de turboalimentadores completos con calidad de equipo original. También somos distribuidores oficiales de Master Power.",
    src: "/nosotros/2-turbo.jpg",
    alt: "Turboalimentador nuevo",
  },
  {
    etiqueta: "Cobertura",
    titulo: "Para cualquier tipo de vehículo",
    texto:
      "Vehículos livianos, de carga, agrícolas y maquinaria pesada: encuentra el turbo que necesitas por referencia, marca o vehículo.",
    src: "/nosotros/3-carretera.jpg",
    alt: "Camión de carga en carretera",
  },
  {
    etiqueta: "Cotiza fácil",
    titulo: "Rápido y sin complicaciones",
    texto:
      "Arma tu cotización en línea, revisa la disponibilidad de cada producto y envíala directo a un asesor por WhatsApp.",
    src: "/nosotros/4-cotizacion-whatsapp.jpg",
    alt: "Asesor respondiendo una cotización por WhatsApp",
  },
];

// Solo datos que el sitio ya muestra y se pueden comprobar
const cifras = [
  { valor: "4", texto: "sedes: Bogotá, Medellín, Cali y Duitama" },
  { valor: "2", texto: "marcas oficiales: Turboman y Master Power" },
  { valor: String(categorias.length), texto: "líneas de producto, del turbo completo al actuador" },
];

export default function Nosotros() {
  return (
    <main>
      <section className="fondo-marca border-b-4 border-[#e8233b] px-6 py-14 text-center text-white">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Quiénes somos</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Nosotros</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/70">
            Turboalimentadores y repuestos con calidad de equipo original, con atención directa en cuatro ciudades.
          </p>
        </Reveal>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <ul className="mx-auto grid max-w-6xl gap-px bg-slate-200 sm:grid-cols-3">
          {cifras.map((c) => (
            <li key={c.texto} className="flex items-center gap-4 bg-white px-6 py-6">
              <span className="text-4xl font-bold text-[#d91e34]">{c.valor}</span>
              <span className="text-sm text-slate-600">{c.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl space-y-14 px-6 py-14 sm:px-8 md:space-y-20">
        {bloques.map((b, i) => (
          <Reveal key={b.titulo}>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className={`overflow-hidden rounded-lg border border-slate-200 ${i % 2 ? "md:order-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#d91e34]">{b.etiqueta}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1a2150] md:text-3xl">{b.titulo}</h2>
                <p className="mt-4 text-lg text-slate-600">{b.texto}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="fondo-marca px-6 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">¿Buscas un turbo o un repuesto?</h2>
            <p className="mt-1 text-white/70">Búscalo en el catálogo o escríbenos con la referencia o el vehículo.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/productos"
              className="rounded-md bg-[#d91e34] px-6 py-3 font-semibold text-white transition hover:bg-[#b8172b]"
            >
              Ver catálogo
            </Link>
            <a
              href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Hola, quiero información sobre un turbo.")}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track="nosotros-whatsapp"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#1a2150]"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
