"use client";

import { useActionState } from "react";
import Link from "next/link";
import { categorias, type Producto } from "@/data/productos";
import type { Estado } from "./acciones";

const campo =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#e8233b]";
const etiqueta = "mb-1 block text-sm font-semibold text-[#1a2150]";

export default function FormularioProducto({
  accion,
  producto,
}: {
  accion: (prev: Estado, fd: FormData) => Promise<Estado>;
  producto?: Producto;
}) {
  const [estado, enviar, enviando] = useActionState(accion, {});

  return (
    <form action={enviar} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="referencia" className={etiqueta}>Referencia *</label>
          <input
            id="referencia"
            name="referencia"
            required
            defaultValue={producto?.referencia}
            placeholder="TB-1001"
            className={`${campo} uppercase`}
          />
        </div>
        <div>
          <label htmlFor="marca" className={etiqueta}>Marca *</label>
          <input
            id="marca"
            name="marca"
            required
            list="marcas"
            defaultValue={producto?.marca ?? "Turboman"}
            className={campo}
          />
          <datalist id="marcas">
            <option value="Turboman" />
            <option value="Master Power" />
          </datalist>
        </div>
      </div>

      <div>
        <label htmlFor="nombre" className={etiqueta}>Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          required
          defaultValue={producto?.nombre}
          placeholder="Turboalimentador HX35"
          className={campo}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="categoria" className={etiqueta}>Categoría *</label>
          <select
            id="categoria"
            name="categoria"
            required
            defaultValue={producto?.categoria ?? ""}
            className={campo}
          >
            <option value="" disabled>Elige una</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="precio" className={etiqueta}>Precio (COP) *</label>
          <input
            id="precio"
            name="precio"
            required
            inputMode="numeric"
            defaultValue={producto?.precio}
            placeholder="2850000"
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="stock" className={etiqueta}>Stock *</label>
          <input
            id="stock"
            name="stock"
            required
            inputMode="numeric"
            defaultValue={producto?.stock ?? 0}
            className={campo}
          />
        </div>
      </div>

      <div>
        <label htmlFor="vehiculos" className={etiqueta}>Vehículos compatibles</label>
        <textarea
          id="vehiculos"
          name="vehiculos"
          rows={4}
          defaultValue={producto?.vehiculos.join("\n")}
          placeholder={"Uno por línea, con el formato Marca Modelo:\nChevrolet NPR\nKenworth T800"}
          className={campo}
        />
        <p className="mt-1 text-xs text-slate-400">
          Estos nombres alimentan el buscador y el asistente por vehículo.
        </p>
      </div>

      <div>
        <label htmlFor="imagen" className={etiqueta}>Foto (opcional)</label>
        <input
          id="imagen"
          name="imagen"
          defaultValue={producto?.imagen}
          placeholder="/productos/tb-1001.jpg o https://..."
          className={campo}
        />
      </div>

      {estado.error && (
        <p aria-live="polite" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {estado.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          disabled={enviando}
          className="rounded-full bg-[#e8233b] px-8 py-3 font-semibold text-white transition hover:brightness-90 disabled:opacity-60"
        >
          {enviando ? "Guardando…" : "Guardar"}
        </button>
        <Link
          href="/panel/productos"
          className="rounded-full border-2 border-[#1a2150] px-8 py-3 font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
