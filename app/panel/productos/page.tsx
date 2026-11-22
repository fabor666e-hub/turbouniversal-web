import Link from "next/link";
import { redirect } from "next/navigation";
import { categorias, type Producto } from "@/data/productos";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sesionValida } from "@/lib/sesionPanel";
import { normalizar, precio } from "@/lib/utils";
import { cambiarStock } from "./acciones";
import BotonBorrar from "./BotonBorrar";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Productos | Panel | Turbo Universal",
  robots: { index: false, follow: false },
};

const mensajes: Record<string, string> = {
  creado: "Producto creado",
  editado: "Cambios guardados",
  borrado: "Producto borrado",
};

export default async function AdminProductos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; ref?: string }>;
}) {
  if (!(await sesionValida())) redirect("/panel");
  const { q = "", ok, ref } = await searchParams;

  if (!supabaseAdmin) {
    return (
      <main className="mx-auto max-w-xl px-8 py-20 text-red-600">
        Falta SUPABASE_SERVICE_ROLE_KEY en .env.local (y reiniciar el servidor).
      </main>
    );
  }

  const { data, error } = await supabaseAdmin.from("productos").select("*").order("referencia");
  const todos = (data ?? []) as Producto[];
  const buscado = normalizar(q.trim());
  const lista = buscado
    ? todos.filter((p) =>
        normalizar([p.referencia, p.nombre, p.marca, ...(p.vehiculos ?? []), ...(p.oem ?? [])].join(" ")).includes(buscado)
      )
    : todos;
  const nombreCategoria = (slug: string) => categorias.find((c) => c.slug === slug)?.nombre ?? slug;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <Link href="/panel" className="text-sm text-slate-400 hover:text-[#e8233b]">
        ← Volver al panel
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#1a2150]">Productos</h1>
        <Link
          href="/panel/productos/nuevo"
          className="rounded-md bg-[#d91e34] px-6 py-3 font-semibold text-white transition hover:brightness-90"
        >
          + Nuevo producto
        </Link>
      </div>

      {ok && mensajes[ok] && (
        <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {mensajes[ok]}{ref ? `: ${ref}` : ""}.
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          No se pudieron leer los productos: {error.message}
        </p>
      )}

      <form className="mt-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por referencia, nombre, marca o vehículo"
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 outline-none focus:border-[#e8233b]"
        />
        <button className="rounded-md bg-[#1a2150] px-6 py-3 font-semibold text-white transition hover:bg-[#d91e34]">
          Buscar
        </button>
      </form>
      <p className="mt-2 text-sm text-slate-400">
        {lista.length} de {todos.length} productos
        {q && (
          <>
            {" · "}
            <Link href="/panel/productos" className="underline hover:text-[#e8233b]">Ver todos</Link>
          </>
        )}
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Referencia</th>
              <th className="px-4">Producto</th>
              <th className="px-4">Categoría</th>
              <th className="px-4 text-right">Precio</th>
              <th className="px-4 text-center">Stock</th>
              <th className="px-4" />
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.referencia} className="border-t align-middle">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#1a2150]">{p.referencia}</td>
                <td className="px-4">
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-xs text-slate-400">{p.marca}</p>
                </td>
                <td className="px-4 text-slate-500">{nombreCategoria(p.categoria)}</td>
                <td className="whitespace-nowrap px-4 text-right">{precio(p.precio)}</td>
                <td className="px-4">
                  <div className="flex items-center justify-center gap-2">
                    <form action={cambiarStock}>
                      <input type="hidden" name="referencia" value={p.referencia} />
                      <input type="hidden" name="delta" value="-1" />
                      <button
                        disabled={p.stock === 0}
                        aria-label={`Restar una unidad a ${p.referencia}`}
                        className="h-8 w-8 rounded-full border border-slate-300 font-bold transition hover:bg-slate-100 disabled:opacity-30"
                      >
                        −
                      </button>
                    </form>
                    <span
                      className={`w-8 text-center font-bold ${
                        p.stock === 0 ? "text-red-600" : p.stock <= 3 ? "text-amber-600" : "text-[#1a2150]"
                      }`}
                    >
                      {p.stock}
                    </span>
                    <form action={cambiarStock}>
                      <input type="hidden" name="referencia" value={p.referencia} />
                      <input type="hidden" name="delta" value="1" />
                      <button
                        aria-label={`Sumar una unidad a ${p.referencia}`}
                        className="h-8 w-8 rounded-full border border-slate-300 font-bold transition hover:bg-slate-100"
                      >
                        +
                      </button>
                    </form>
                  </div>
                </td>
                <td className="px-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/panel/productos/${encodeURIComponent(p.referencia)}`}
                      className="text-sm font-semibold text-[#1a2150] hover:text-[#e8233b]"
                    >
                      Editar
                    </Link>
                    <BotonBorrar referencia={p.referencia} nombre={p.nombre} />
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  {todos.length === 0 ? "Aún no hay productos. Crea el primero." : "Ningún producto coincide con la búsqueda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
