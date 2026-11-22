"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Producto } from "@/data/productos";
import { fotoDe, precio } from "@/lib/utils";
import { estadoStock } from "@/lib/reglas";
import { usarCotizacion } from "./Cotizacion";
import { IconoTurbo } from "./Iconos";

// Aparece suavemente al hacer scroll
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Turbo animado (gira solo)
export function TurboAnimado() {
  return (
    <svg viewBox="0 0 200 200" className="h-72 w-72">
      <circle cx="100" cy="100" r="94" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="4" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="2" />
      <g className="turbo-spin">
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d="M100 100 C 115 70, 140 50, 170 55 C 150 75, 125 95, 100 100Z"
            fill="white"
            fillOpacity="0.85"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="12" fill="white" />
    </svg>
  );
}

export function EtiquetaStock({ stock }: { stock: number | null }) {
  const estado = estadoStock(stock);
  if (estado === "consultar")
    return <span className="rounded px-2 py-0.5 text-xs font-semibold text-[#1a2150] bg-slate-100 ring-1 ring-slate-200">Consulta disponibilidad</span>;
  if (estado === "agotado")
    return <span className="rounded px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-50 ring-1 ring-red-200">Agotado</span>;
  if (estado === "pocas")
    return <span className="rounded px-2 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 ring-1 ring-amber-200">Pocas unidades ({stock})</span>;
  return <span className="rounded px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-50 ring-1 ring-green-200">Disponible ({stock})</span>;
}

// Botón "Agregar a cotización": en las tarjetas y en la ficha del producto (grande)
export function BotonAgregar({ p, grande = false }: { p: Producto; grande?: boolean }) {
  const { agregar, cantidadDe } = usarCotizacion();
  const enCotizacion = cantidadDe(p.referencia);
  return (
    <button
      onClick={() => agregar(p)}
      disabled={p.stock === 0}
      data-track={grande ? "ficha-agregar" : undefined}
      className={`w-full rounded-md font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
        grande ? "py-4" : "mt-3 py-2.5 text-sm"
      } ${enCotizacion > 0 ? "bg-green-700 hover:bg-green-800" : "bg-[#1a2150] hover:bg-[#d91e34]"}`}
    >
      {enCotizacion > 0 ? `✓ En cotización (${enCotizacion})` : "Agregar a cotización"}
    </button>
  );
}

export function TarjetaProducto({ p }: { p: Producto }) {
  const foto = fotoDe(p);

  return (
    <div data-ref={p.referencia} className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 transition duration-300 hover:border-slate-300 hover:shadow-md">
      <div className="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-slate-50">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto}
            alt={p.nombre}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <IconoTurbo className="h-16 w-16 text-slate-300" />
        )}
      </div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="font-mono text-xs font-semibold tracking-wide text-slate-500">{p.referencia}</span>
        <EtiquetaStock stock={p.stock} />
      </div>
      <Link
        href={`/productos/${p.referencia}`}
        className="block font-semibold text-[#1a2150] transition-colors hover:text-[#e8233b]"
      >
        {p.nombre}
      </Link>
      <p className="mt-1 flex-1 text-sm text-slate-500">{p.vehiculos.join(" · ")}</p>
      <p className={`mt-3 font-bold ${p.precio === null ? "text-base text-slate-500" : "text-lg text-[#1a2150]"}`}>
        {precio(p.precio)}
      </p>
      <BotonAgregar p={p} />
    </div>
  );
}