import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Producto } from "@/data/productos";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sesionValida } from "@/lib/sesionPanel";
import { editarProducto } from "../acciones";
import FormularioProducto from "../FormularioProducto";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Editar producto | Panel | Turbo Universal",
  robots: { index: false, follow: false },
};

export default async function EditarProducto({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  if (!(await sesionValida())) redirect("/panel");
  if (!supabaseAdmin) redirect("/panel/productos");

  const referencia = decodeURIComponent((await params).referencia);
  const { data } = await supabaseAdmin
    .from("productos")
    .select("*")
    .eq("referencia", referencia)
    .maybeSingle();
  if (!data) notFound();

  const raw = data as Producto & { vehiculos: string[] | null; imagen: string | null };
  const producto: Producto = { ...raw, vehiculos: raw.vehiculos ?? [], imagen: raw.imagen ?? undefined };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <Link href="/panel/productos" className="text-sm text-slate-400 hover:text-[#e8233b]">
        ← Volver a productos
      </Link>
      <h1 className="mb-6 mt-2 text-3xl font-extrabold text-[#1a2150]">
        Editar {producto.referencia}
      </h1>
      <FormularioProducto accion={editarProducto.bind(null, producto.referencia)} producto={producto} />
    </main>
  );
}
