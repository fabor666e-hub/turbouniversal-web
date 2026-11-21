"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconoBuscar } from "./Iconos";

export default function BuscadorHero({ alinear = "centro" }: { alinear?: "centro" | "izquierda" }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const buscar = (texto: string) => {
    const t = texto.trim();
    router.push(t ? `/productos?q=${encodeURIComponent(t)}` : "/productos");
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          buscar(q);
        }}
        className="mt-8 flex items-center rounded-md bg-white p-1.5 shadow-lg ring-1 ring-black/5"
      >
        <span className="pl-3 text-slate-400"><IconoBuscar className="h-5 w-5" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: HX35, Chevrolet NPR, Duster..."
          className="w-full min-w-0 bg-transparent px-3 py-3 text-base text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="rounded-md bg-[#d91e34] px-6 py-3 font-semibold text-white transition hover:bg-[#b8172b]"
        >
          Buscar
        </button>
      </form>

      <div className={`mt-4 flex flex-wrap items-center gap-2 text-sm ${alinear === "centro" ? "justify-center" : ""}`}>
        <span className="text-white/60">Prueba con:</span>
        {["HX35", "NPR", "Duster", "Kenworth", "CAT 3116"].map((s) => (
          <button
            key={s}
            onClick={() => buscar(s)}
            className="rounded border border-white/25 px-3 py-1 text-white/85 transition hover:border-white hover:bg-white hover:text-[#1a2150]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}