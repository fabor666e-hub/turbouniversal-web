import Link from "next/link";
import { Reveal } from "../components/Comunes";
import { obtenerProductos } from "@/lib/datos";
import { NUMERO_WHATSAPP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marcas | Turbo Universal",
  description:
    "Conoce las marcas que distribuye Turbo Universal: Turboman y Master Power, turboalimentadores y repuestos con calidad de equipo original.",
};

// EDITA estos textos con la información real de cada marca.
// Para mostrar un logo, guarda la imagen en public/marcas/ y escribe su ruta en logo.
const marcas = [
  {
    nombre: "Turboman",
    etiqueta: "Nuestra marca",
    texto:
      "Marca registrada en Colombia de turboalimentadores completos con calidad de equipo original. Turbos, cartridges, kits de reparación y más para vehículos livianos, de carga y maquinaria.",
    logo: "",
    fondo: "from-[#e8233b] to-[#b3162c]",
  },
  {
    nombre: "Master Power",
    etiqueta: "Marca aliada",
    texto:
      "Marca aliada que complementa nuestro portafolio de turboalimentadores y repuestos. Consulta con un asesor las referencias disponibles.",
    logo: "",
    fondo: "from-[#1a2150] to-[#2a3580]",
  },
];

const normalizar = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "");

export default async function Marcas() {
  const productos = await obtenerProductos();
  const cuantos = (marca: string) =>
    productos.filter((p) => normalizar(p.marca) === normalizar(marca)).length;

  return (
    <main>
      <section
        className="bg-gradient-to-br from-[#1a2150] via-[#1a2150] to-[#2a3580] px-6 pb-20 pt-14 text-center text-white"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <Reveal>
          <h1 className="text-4xl font-extrabold md:text-5xl">Nuestras marcas</h1>
          <p className="mt-3 text-lg text-white/70">
            Turboalimentadores y repuestos con calidad de equipo original
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-8 py-12 md:grid-cols-2">
        {marcas.map((m, i) => {
          const total = cuantos(m.nombre);
          return (
            <Reveal key={m.nombre} delay={i * 120}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl rounded-br-[5rem] bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${m.fondo} p-8`}>
                  {m.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.logo} alt={`Logo ${m.nombre}`} className="max-h-28 w-auto object-contain" />
                  ) : (
                    <span className="text-4xl font-extrabold uppercase italic tracking-wider text-white md:text-5xl">
                      {m.nombre}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#e8233b]">
                    {m.etiqueta}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-[#1a2150]">{m.nombre}</h2>
                  <p className="mt-3 flex-1 text-slate-600">{m.texto}</p>
                  <div className="mt-6">
                    {total > 0 ? (
                      <Link
                        href={`/productos?q=${encodeURIComponent(m.nombre)}`}
                        data-track={`marcas-${normalizar(m.nombre)}`}
                        className="inline-block rounded-full bg-[#1a2150] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e8233b]"
                      >
                        Ver {total} producto{total > 1 ? "s" : ""} →
                      </Link>
                    ) : (
                      <a
                        href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(`Hola, quiero información sobre los productos ${m.nombre}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track={`marcas-${normalizar(m.nombre)}-whatsapp`}
                        className="inline-block rounded-full border-2 border-green-600 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
                      >
                        Consultar por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
    </main>
  );
}
