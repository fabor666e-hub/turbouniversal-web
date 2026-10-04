"use client";

import { useEffect, useState } from "react";
import { categorias, type Producto } from "@/data/productos";
import {
  AZUL, ROJO, LINK_CATALOGO, NUMERO_WHATSAPP,
  colores, normalizar, fotoCategoria,
} from "@/lib/utils";
import { Reveal, TarjetaProducto, TurboAnimado } from "./Comunes";
import { usarCotizacion } from "./Cotizacion";
import { registrar } from "@/lib/rastreo";

export default function Catalogo({
  productos,
  qInicial,
  catInicial,
}: {
  productos: Producto[];
  qInicial: string;
  catInicial: string | null;
}) {
  const { acento, setAcento } = usarCotizacion();
  const [busqueda, setBusqueda] = useState(qInicial);
  const [categoria, setCategoria] = useState<string | null>(catInicial);
  const modoAzul = acento === AZUL;

  // Si llegó desde el Inicio con una categoría, aplica su color y baja a la lista
  useEffect(() => {
    if (catInicial) {
      setAcento(colores[catInicial] ?? ROJO);
          registrar("categoria", catInicial);
      setTimeout(() => {
        document
          .getElementById("lista-productos")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
    // Al salir del catálogo, el color vuelve al rojo
    return () => setAcento(ROJO);
  }, [catInicial, setAcento]);
  useEffect(() => {
    const t = busqueda.trim();
    if (t.length < 2) return;
    const id = setTimeout(() => registrar("busqueda", normalizar(t)), 1200);
    return () => clearTimeout(id);
  }, [busqueda]);

  const elegirCategoria = (slug: string, activa: boolean) => {
    const nueva = activa ? null : slug;
    setCategoria(nueva);
      if (nueva) registrar("categoria", nueva);
    setAcento(nueva ? colores[nueva] ?? ROJO : ROJO);
    if (nueva) {
      setTimeout(() => {
        document
          .getElementById("lista-productos")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const q = normalizar(busqueda.trim());
  const lista = productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!q ||
        normalizar([p.referencia, p.nombre, p.marca, ...p.vehiculos].join(" ")).includes(q))
  );
  const nombreCat = categorias.find((c) => c.slug === categoria)?.nombre;

  const titulo = q
    ? `${lista.length} resultado${lista.length !== 1 ? "s" : ""} para “${busqueda}”${
        nombreCat ? ` en ${nombreCat}` : ""
      }`
    : nombreCat ?? "Todos los productos";

  return (
    <>
      {/* Encabezado con buscador */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#1a2150] via-[#1a2150] to-[#2a3580] px-6 pb-24 pt-14 text-white"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#e8233b] via-[#e8233b] to-[#b3162c] transition-opacity duration-700"
          style={{ opacity: modoAzul ? 1 : 0 }}
        />
        <div className="flotar pointer-events-none absolute -right-10 top-4 hidden opacity-25 md:block">
          <TurboAnimado />
        </div>

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">Catálogo de productos</h1>
          <p className="mt-3 text-lg text-white/70">
            Busca por referencia, marca o vehículo
          </p>

          <div
            className="mt-8 flex items-center rounded-full bg-white p-2 transition-all duration-700"
            style={{ boxShadow: `0 0 0 4px ${acento}99, 0 10px 40px ${acento}73` }}
          >
            <span className="pl-5 text-2xl text-slate-400">🔍</span>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: HX35, Chevrolet NPR, Duster..."
              className="w-full bg-transparent px-4 py-4 text-lg text-slate-800 outline-none placeholder:text-slate-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="mr-2 rounded-full px-3 py-2 text-sm text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
            <a
              href="#lista-productos"
              className="rounded-full bg-[var(--acento)] px-8 py-4 font-semibold text-white transition duration-700 hover:brightness-90"
            >
              Buscar
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/60">Prueba con:</span>
            {["HX35", "NPR", "Duster", "Kenworth", "CAT 3116"].map((s) => (
              <button
                key={s}
                onClick={() => setBusqueda(s)}
                className="rounded-full border border-white/30 px-4 py-1.5 transition hover:border-white hover:bg-white hover:text-[#1a2150]"
              >
                {s}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-8 py-10">
        <Reveal>
          <h2 className="mb-4 text-2xl font-bold text-[#1a2150]">
            Categorías
            <span className="mt-2 block h-1 w-16 rounded-full bg-[var(--acento)] transition-colors duration-700" />
          </h2>
        </Reveal>
        <a
          href={LINK_CATALOGO}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 inline-block rounded-full border-2 border-[#1a2150] px-5 py-2 text-sm font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
        >
          📖 Ver catálogo completo
        </a>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((c, i) => {
            const activa = categoria === c.slug;
            const cantidad = productos.filter((p) => p.categoria === c.slug).length;
            const foto = fotoCategoria(c.slug);
            return (
              <Reveal key={c.slug} delay={i * 70}>
                <button
                  onClick={() => elegirCategoria(c.slug, activa)}
                  className={`h-full w-full rounded-2xl rounded-br-[3rem] p-6 text-left transition duration-500 ${
                    activa
                      ? "scale-[1.03] bg-[var(--acento)] text-white shadow-xl"
                      : "bg-white text-[#1a2150] shadow hover:-translate-y-2 hover:shadow-xl"
                  }`}
                >
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto} alt={c.nombre} className="mb-3 h-20 w-auto object-contain" />
                  ) : (
                    <span
                      className="mb-3 block h-1.5 w-10 rounded-full"
                      style={{ backgroundColor: activa ? "white" : colores[c.slug] }}
                    />
                  )}
                  <span className="block text-lg font-semibold">{c.nombre}</span>
                  <span className={`text-sm ${activa ? "text-white/80" : "text-slate-400"}`}>
                    {cantidad} producto{cantidad !== 1 && "s"}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Lista de productos */}
      <section id="lista-productos" className="mx-auto max-w-6xl scroll-mt-24 px-8 pb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-[var(--acento)] transition-colors duration-700">
            {titulo}
          </h3>
          {(categoria || busqueda) && (
            <button
              onClick={() => {
                setBusqueda("");
                setCategoria(null);
                setAcento(ROJO);
              }}
              className="text-sm font-semibold text-slate-500 underline hover:text-[#e8233b]"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((p, i) => (
            <Reveal key={p.referencia} delay={(i % 4) * 80}>
              <TarjetaProducto p={p} />
            </Reveal>
          ))}
        </div>

        {lista.length === 0 && (
          <p className="text-slate-500">
            No encontramos coincidencias.{" "}
            <a
              className="font-semibold text-[#e8233b] underline"
              href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
                `Hola, busco: ${busqueda}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escríbenos y te cotizamos.
            </a>
          </p>
        )}
      </section>
    </>
  );
}