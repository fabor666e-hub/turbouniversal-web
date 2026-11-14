"use client";

import { borrarProducto } from "./acciones";

export default function BotonBorrar({ referencia, nombre }: { referencia: string; nombre: string }) {
  return (
    <form
      action={borrarProducto}
      onSubmit={(e) => {
        if (!confirm(`¿Borrar ${referencia} · ${nombre}?\nEsta acción no se puede deshacer.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="referencia" value={referencia} />
      <button className="text-sm font-semibold text-slate-400 transition hover:text-red-600">
        Borrar
      </button>
    </form>
  );
}
