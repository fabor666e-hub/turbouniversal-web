"use client";

import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Producto } from "@/data/productos";
import { ROJO } from "@/lib/utils";
import { registrar } from "@/lib/rastreo";

export type ItemCotizacion = { p: Producto; cantidad: number };

type Contexto = {
  items: ItemCotizacion[];
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  acento: string;
  setAcento: (c: string) => void;
  totalUnidades: number;
  totalPrecio: number;
  cantidadDe: (ref: string) => number;
  agregar: (p: Producto) => void;
  cambiar: (ref: string, delta: number) => void;
  quitar: (ref: string) => void;
};

const Ctx = createContext<Contexto | null>(null);
const CLAVE = "turbo-universal-cotizacion";

export function usarCotizacion() {
  // Es un hook personalizado con nombre en español (no empieza por "use").
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const c = useContext(Ctx);
  if (!c) throw new Error("Falta el Proveedor en layout.tsx");
  return c;
}

export function Proveedor({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [acento, setAcento] = useState(ROJO);
  const [cargado, setCargado] = useState(false);

  // Al abrir la página: recupera la cotización guardada en el navegador
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) {
        const lista = JSON.parse(guardado) as ItemCotizacion[];
        if (Array.isArray(lista)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(lista.filter((i) => i?.p?.referencia && i.cantidad > 0));
        }
      }
    } catch {
      // Si el navegador no deja leer, se empieza con la cotización vacía
    }
    setCargado(true);
  }, []);

  // Cada vez que cambia la cotización: la guarda en el navegador
  useEffect(() => {
    if (!cargado) return;
    try {
      if (items.length > 0) localStorage.setItem(CLAVE, JSON.stringify(items));
      else localStorage.removeItem(CLAVE);
    } catch {
      // Si el navegador no deja guardar, la cotización sigue funcionando sin guardarse
    }
  }, [items, cargado]);

  const cantidadDe = (ref: string) => items.find((i) => i.p.referencia === ref)?.cantidad ?? 0;
  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0);
  const totalPrecio = items.reduce((s, i) => s + i.cantidad * i.p.precio, 0);

  const agregar = (p: Producto) => {
    registrar("agregar_cotizacion", p.referencia);
    setItems((prev) => {
      const existe = prev.find((i) => i.p.referencia === p.referencia);
      if (existe) {
        return prev.map((i) =>
          i.p.referencia === p.referencia
            ? { ...i, cantidad: Math.min(i.cantidad + 1, p.stock) }
            : i
        );
      }
      return [...prev, { p, cantidad: 1 }];
    });
    setAbierto(true);
  };

  const cambiar = (ref: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.p.referencia === ref
            ? { ...i, cantidad: Math.min(i.cantidad + delta, i.p.stock) }
            : i
        )
        .filter((i) => i.cantidad > 0)
    );
  };

  const quitar = (ref: string) =>
    setItems((prev) => prev.filter((i) => i.p.referencia !== ref));

  return (
    <Ctx.Provider
      value={{
        items, abierto, setAbierto, acento, setAcento,
        totalUnidades, totalPrecio, cantidadDe, agregar, cambiar, quitar,
      }}
    >
      <div
        className="min-h-screen bg-slate-50 text-slate-800"
        style={{ "--acento": acento } as CSSProperties}
      >
        <style>{`
          html { scroll-behavior: smooth; }
          @keyframes girar { to { transform: rotate(360deg); } }
          .turbo-spin { transform-origin: 100px 100px; animation: girar 8s linear infinite; }
          @keyframes flotar { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
          .flotar { animation: flotar 5s ease-in-out infinite; }
          @keyframes pulso { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); } 100% { box-shadow: 0 0 0 18px rgba(34,197,94,0); } }
          .pulso { animation: pulso 2s infinite; }
        `}</style>
        {children}
      </div>
    </Ctx.Provider>
  );
}