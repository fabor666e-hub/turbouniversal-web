"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Producto } from "@/data/productos";
import { fotoDe, precio } from "@/lib/utils";
import { usarCotizacion } from "./Cotizacion";

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
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
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

export function EtiquetaStock({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Agotado</span>;
  if (stock <= 3)
    return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Pocas unidades ({stock})</span>;
  return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Disponible ({stock})</span>;
}

export function TarjetaProducto({ p }: { p: Producto }) {
  const { agregar, cantidadDe } = usarCotizacion();
  const enCotizacion = cantidadDe(p.referencia);
  const foto = fotoDe(p);

  return (
    <div className="h-full rounded-2xl bg-white p-5 shadow transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-100">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto}
            alt={p.nombre}
            className="h-full w-full object-contain p-2 transition duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-4xl text-slate-300">⚙️</span>
        )}
      </div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400">Ref. {p.referencia}</span>
        <EtiquetaStock stock={p.stock} />
      </div>
      <Link
        href={`/productos/${p.referencia}`}
        className="block font-semibold text-[#1a2150] transition-colors hover:text-[#e8233b]"
      >
        {p.nombre}
      </Link>
      <p className="mt-1 text-sm text-slate-500">{p.vehiculos.join(" · ")}</p>
      <p className="mt-3 text-lg font-bold text-[var(--acento)] transition-colors duration-700">
        {precio(p.precio)}
      </p>
      <button
        onClick={() => agregar(p)}
        disabled={p.stock === 0}
        className={`mt-3 w-full rounded-full py-2 text-sm font-medium text-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 ${
          enCotizacion > 0
            ? "bg-green-600 hover:bg-green-700"
            : "bg-[#1a2150] hover:bg-[#e8233b]"
        }`}
      >
        {enCotizacion > 0 ? `✓ En cotización (${enCotizacion})` : "Agregar a cotización"}
      </button>
    </div>
  );
}