"use client";

import { IconoBuscar, IconoLibro } from "./Iconos";
import { useEffect, useState } from "react";
import { categorias, type Producto } from "@/data/productos";
import {
  ROJO, LINK_CATALOGO, NUMERO_WHATSAPP,
  colores, normalizar, fotoCategoria,
} from "@/lib/utils";
import { Reveal, TarjetaProducto } from "./Comunes";
import { usarCotizacion } from "./Cotizacion";
import { buscarProductos } from "@/lib/reglas";
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
  const { setAcento } = usarCotizacion();
  const [busqueda, setBusqueda] = useState(qInicial);
  const [categoria, setCategoria] = useState<string | null>(catInicial);

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
  const lista = buscarProductos(productos, busqueda, categoria ?? "");
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
        className="relative overflow-hidden fondo-marca border-b-4 border-[#e8233b] px-6 py-14 text-white"
      >

        <Reveal className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Catálogo de productos</h1>
          <p className="mt-3 text-lg text-white/70">
            Busca por referencia, marca o vehículo
          </p>

          <div className="mt-8 flex items-center rounded-md bg-white p-1.5 shadow-lg ring-1 ring-black/5">
            <span className="pl-3 text-slate-400"><IconoBuscar className="h-5 w-5" /></span>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: HX35, Chevrolet NPR, Duster..."
              className="w-full min-w-0 bg-transparent px-3 py-3 text-base text-slate-800 outline-none placeholder:text-slate-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="mr-2 rounded-md px-3 py-2 text-sm text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
            <a
              href="#lista-productos"
              className="rounded-md bg-[#d91e34] px-6 py-3 font-semibold text-white transition hover:bg-[#b8172b]"
            >
              Buscar
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/60">Prueba con:</span>
            {["HX35", "NPR", "Duster", "Kenworth", "CAT 3116"].map((s) => (
              <button
                key={s}
                onClick={() => setBusqueda(s)}
                className="rounded border border-white/25 px-3 py-1 text-white/85 transition hover:border-white hover:bg-white hover:text-[#1a2150]"
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
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--acento)] transition-colors duration-500">
            Filtrar por
          </p>
          <h2 className="mb-4 mt-1 text-2xl font-bold tracking-tight text-[#1a2150]">Categorías</h2>
        </Reveal>
        <a
          href={LINK_CATALOGO}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 inline-block rounded-md border border-[#1a2150] px-4 py-2 text-sm font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
        >
          <IconoLibro className="mr-2 inline h-4 w-4 align-[-2px]" />
          Ver catálogo completo
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
                  className={`h-full w-full rounded-lg border p-5 text-left transition duration-300 ${
                    activa
                      ? "border-[var(--acento)] bg-[var(--acento)] text-white shadow-md"
                      : "border-slate-200 bg-white text-[#1a2150] hover:border-slate-300 hover:shadow-md"
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
                  <span className="block font-semibold">{c.nombre}</span>
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