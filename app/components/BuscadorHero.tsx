"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuscadorHero() {
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
        className="mt-10 flex items-center rounded-full bg-white p-2 shadow-[0_10px_40px_rgba(232,35,59,0.45)] ring-4 ring-[#e8233b]/60"
      >
        <span className="pl-5 text-2xl text-slate-400">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: HX35, Chevrolet NPR, Duster..."
          className="w-full bg-transparent px-4 py-4 text-lg text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="rounded-full bg-[#e8233b] px-8 py-4 font-semibold text-white transition hover:bg-[#c71c32]"
        >
          Buscar
        </button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-white/60">Prueba con:</span>
        {["HX35", "NPR", "Duster", "Kenworth", "CAT 3116"].map((s) => (
          <button
            key={s}
            onClick={() => buscar(s)}
            className="rounded-full border border-white/30 px-4 py-1.5 transition hover:border-white hover:bg-white hover:text-[#1a2150]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}