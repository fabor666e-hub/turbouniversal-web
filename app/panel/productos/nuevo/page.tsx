import Link from "next/link";
import { redirect } from "next/navigation";
import { sesionValida } from "@/lib/sesionPanel";
import { crearProducto } from "../acciones";
import FormularioProducto from "../FormularioProducto";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Nuevo producto | Panel | Turbo Universal",
  robots: { index: false, follow: false },
};

export default async function NuevoProducto() {
  if (!(await sesionValida())) redirect("/panel");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <Link href="/panel/productos" className="text-sm text-slate-400 hover:text-[#e8233b]">
        ← Volver a productos
      </Link>
      <h1 className="mb-6 mt-2 text-3xl font-extrabold text-[#1a2150]">Nuevo producto</h1>
      <FormularioProducto accion={crearProducto} />
    </main>
  );
}
