import Link from "next/link";
import type { ReactNode } from "react";
import { categorias } from "@/data/productos";
import { obtenerProductos } from "@/lib/datos";
import { NUMERO_WHATSAPP, fotoCategoria } from "@/lib/utils";
import { Reveal, TarjetaProducto } from "./components/Comunes";
import BuscadorHero from "./components/BuscadorHero";
import VideosTurbo from "./components/VideosTurbo";
import BarraMarcas from "./components/BarraMarcas";
import { marcasDeVehiculos } from "@/lib/reglas";
import {
  IconoCaja,
  IconoEscudo,
  IconoLista,
  IconoTurbo,
  IconoUbicacion,
  IconoWhatsApp,
} from "./components/Iconos";

export const dynamic = "force-dynamic";

const SEDES = ["Bogotá", "Medellín", "Cali", "Duitama"];

// Aliados que la empresa muestra en su sitio actual
const ALIADOS = [
  { nombre: "Importadora Turbotec", sigla: "TT", detalle: "Villavicencio, Meta" },
  { nombre: "Uniturbos", sigla: "UT", detalle: "Expertos en turboalimentadores · Zipaquirá, Cundinamarca" },
];

function Titulo({ etiqueta, children, accion }: { etiqueta: string; children: ReactNode; accion?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#e8233b]">{etiqueta}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#1a2150] md:text-3xl">{children}</h2>
      </div>
      {accion}
    </div>
  );
}

export default async function Inicio() {
  const productos = await obtenerProductos();
  // Destacados: los que no están agotados (con stock conocido o a consultar)
  const destacados = productos.filter((p) => p.stock === null || p.stock > 0).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="fondo-marca border-b-4 border-[#e8233b] px-6 py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ff8a98]">
              Importadora de turboalimentadores · Colombia
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Turbos y repuestos con calidad de equipo original
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              Busca por referencia, marca o vehículo, revisa la disponibilidad y cotiza con un asesor.
            </p>
            <BuscadorHero alinear="izquierda" />
            <Link
              href="/asistente"
              data-track="inicio_asistente"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-[#e8233b] decoration-2 underline-offset-4 transition hover:text-[#ff8a98]"
            >
              ¿No conoces la referencia? Busca por vehículo →
            </Link>
          </Reveal>

          <Reveal delay={150} className="hidden lg:block">
            <div className="rounded-lg border border-white/15 bg-white/5 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Atención directa</p>
              <p className="mt-2 text-xl font-semibold">4 sedes en Colombia</p>
              <ul className="mt-5 space-y-3">
                {SEDES.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-white/85">
                    <IconoUbicacion className="h-4 w-4 text-[#ff8a98]" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3 border-t border-white/15 pt-6">
                <a
                  href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Hola, necesito asesoría con un turbo.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="inicio-hero-whatsapp"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#d91e34] px-4 py-3 text-sm font-semibold transition hover:bg-[#b8172b]"
                >
                  <IconoWhatsApp className="h-4 w-4" />
                  Hablar con un asesor
                </a>
                <Link
                  href="/puntos-de-venta"
                  className="inline-flex items-center justify-center rounded-md border border-white/40 px-4 py-3 text-sm font-semibold transition hover:bg-white hover:text-[#1a2150]"
                >
                  Sedes
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ventajas */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl divide-y divide-slate-200 px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { Icono: IconoEscudo, titulo: "Calidad de equipo original", texto: "Turboalimentadores Turboman, marca registrada en Colombia." },
            { Icono: IconoLista, titulo: "Cotización en línea", texto: "Arma tu lista y envíala a un asesor por WhatsApp." },
            { Icono: IconoCaja, titulo: "Disponibilidad a la vista", texto: "Consulta cuántas unidades hay de cada producto." },
          ].map((v) => (
            <div key={v.titulo} className="flex gap-4 py-7 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#1a2150]/15 bg-[#1a2150]/5 text-[#1a2150]">
                <v.Icono className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[#1a2150]">{v.titulo}</h3>
                <p className="mt-1 text-sm text-slate-500">{v.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marcas de vehículos (barra deslizable) */}
      <BarraMarcas conProductos={marcasDeVehiculos(productos)} />

      {/* Categorías (llevan al catálogo) */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Titulo etiqueta="Catálogo">Líneas de producto</Titulo>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((c, i) => {
            const foto = fotoCategoria(c.slug);
            return (
              <Reveal key={c.slug} delay={i * 50}>
                <Link
                  href={`/productos?cat=${c.slug}`}
                  className="group flex h-full items-center gap-4 rounded-lg border border-slate-200 border-l-4 border-l-transparent bg-white p-5 text-[#1a2150] transition hover:border-l-[#e8233b] hover:shadow-md"
                >
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto} alt={c.nombre} className="h-12 w-12 shrink-0 object-contain" />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1a2150] text-white">
                      <IconoTurbo className="h-8 w-8" />
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold">{c.nombre}</span>
                    <span className="text-sm text-slate-500 transition group-hover:text-[#e8233b]">Ver productos →</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Titulo
            etiqueta="Disponibles hoy"
            accion={
              <Link href="/productos" className="text-sm font-semibold text-[#1a2150] hover:text-[#e8233b]">
                Ver todo el catálogo →
              </Link>
            }
          >
            Productos destacados
          </Titulo>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((p, i) => (
              <Reveal key={p.referencia} delay={i * 60}>
                <TarjetaProducto p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Titulo
          etiqueta="Aprende sobre turbos"
          accion={
            <a
              href="https://www.youtube.com/channel/UCQfjSN6oOd0jt2t5-2hUWtg/featured"
              target="_blank"
              rel="noopener noreferrer"
              data-track="inicio-canal-youtube"
              className="text-sm font-semibold text-[#1a2150] hover:text-[#e8233b]"
            >
              Ver canal de YouTube →
            </a>
          }
        >
          Conoce cómo funciona un turbo
        </Titulo>
        <VideosTurbo />
      </section>

      {/* Marcas que distribuimos */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#e8233b]">Distribuidores oficiales</p>
            <p className="mt-1 text-xl font-bold text-[#1a2150]">Marcas con respaldo y garantía</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { src: "/marcas/turboman.png", alt: "Turboman" },
              { src: "/marcas/master-power.png", alt: "Master Power Turbo" },
            ].map((m) => (
              <Link
                key={m.alt}
                href="/marcas"
                data-track={`inicio-marca-${m.alt.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex h-24 w-40 items-center sm:w-56 justify-center rounded-lg border border-slate-200 bg-white px-6 transition hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt={m.alt} className="max-h-14 w-full object-contain" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Aliados */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-14">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 md:text-left">
            Empresas aliadas que confían en nosotros
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {ALIADOS.map((a) => (
              <div key={a.nombre} className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1a2150] text-sm font-bold text-white">
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

      {/* Llamado a la acción */}
      <section className="fondo-marca px-6 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">¿No encuentras tu referencia?</h2>
            <p className="mt-2 text-white/75">
              Escríbenos con la referencia o el vehículo y un asesor te ayuda a encontrarla.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Hola, estoy buscando un turbo.")}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track="inicio-cta-whatsapp"
              className="inline-flex items-center gap-2 rounded-md bg-[#d91e34] px-6 py-3 font-semibold transition hover:bg-[#b8172b]"
            >
              <IconoWhatsApp className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
            <Link
              href="/asistente"
              className="rounded-md border border-white/50 px-6 py-3 font-semibold transition hover:bg-white hover:text-[#1a2150]"
            >
              Buscar por vehículo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
