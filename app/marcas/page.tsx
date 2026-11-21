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
      "Marca registrada en Colombia de turboalimentadores completos con calidad de equipo original. Somos distribuidores oficiales: turbos, cartridges, kits de reparación y más para vehículos livianos, de carga y maquinaria.",
    logo: "/marcas/turboman.png",
    fondo: "from-[#e8233b] to-[#b3162c]",
  },
  {
    nombre: "Master Power",
    etiqueta: "Distribuidor oficial",
    texto:
      "Somos distribuidores oficiales de Master Power Turbo en Colombia. Turboalimentadores y repuestos con garantía; consulta con un asesor las referencias disponibles.",
    logo: "/marcas/master-power.png",
    fondo: "from-[#1a2150] to-[#2a3580]",
  },
];

// Empresas aliadas que la empresa muestra en su sitio actual (turbouniversal.com.co)
const aliados = [
  { nombre: "Importadora Turbotec", sigla: "TT", detalle: "Villavicencio, Meta" },
  { nombre: "Uniturbos", sigla: "UT", detalle: "Expertos en turboalimentadores · Zipaquirá, Cundinamarca" },
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
        className="fondo-marca border-b-4 border-[#e8233b] px-6 py-14 text-center text-white"
      >
        <Reveal>
          <h1 className="text-4xl font-bold md:text-5xl">Nuestras marcas</h1>
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
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-300 hover:shadow-md">
                <div
                  className={`relative flex h-48 items-center justify-center p-8 ${
                    m.logo ? "bg-white" : `bg-gradient-to-br ${m.fondo}`
                  }`}
                >
                  {m.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.logo} alt={`Logo ${m.nombre}`} className="max-h-28 w-full object-contain" />
                  ) : (
                    <span className="text-4xl font-bold uppercase italic tracking-wider text-white md:text-5xl">
                      {m.nombre}
                    </span>
                  )}
                </div>
                <span className={`block h-2 bg-gradient-to-r ${m.fondo}`} />
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#e8233b]">
                    {m.etiqueta}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-[#1a2150]">{m.nombre}</h2>
                  <p className="mt-3 flex-1 text-slate-600">{m.texto}</p>
                  <div className="mt-6">
                    {total > 0 ? (
                      <Link
                        href={`/productos?q=${encodeURIComponent(m.nombre)}`}
                        data-track={`marcas-${normalizar(m.nombre)}`}
                        className="inline-block rounded-md bg-[#1a2150] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e8233b]"
                      >
                        Ver {total} producto{total > 1 ? "s" : ""} →
                      </Link>
                    ) : (
                      <a
                        href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(`Hola, quiero información sobre los productos ${m.nombre}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track={`marcas-${normalizar(m.nombre)}-whatsapp`}
                        className="inline-block rounded-md border-2 border-green-600 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
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

      {/* Empresas aliadas */}
      <section className="mx-auto max-w-5xl px-8 pb-16">
        <div className="border-t border-slate-200 pt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#e8233b]">Red de aliados</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1a2150]">Los que confían en nosotros</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {aliados.map((a) => (
              <div key={a.nombre} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#1a2150] font-bold text-white">
                  {a.sigla}
                </span>
                <div>
                  <p className="font-semibold text-[#1a2150]">{a.nombre}</p>
                  <p className="text-sm text-slate-500">{a.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
