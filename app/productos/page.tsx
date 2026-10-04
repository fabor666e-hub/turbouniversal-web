import Catalogo from "../components/Catalogo";
import { categorias } from "@/data/productos";
import { obtenerProductos } from "@/lib/datos";

export const metadata = {
  title: "Productos | Turbo Universal",
  description:
    "Catálogo de turboalimentadores, cartridge, kits de reparación y repuestos. Busca por referencia, marca o vehículo.",
};

export const dynamic = "force-dynamic";

export default async function PaginaProductos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const { q, cat } = await searchParams;
  const productos = await obtenerProductos();
  const catValida = categorias.some((c) => c.slug === cat) ? (cat as string) : null;
  return <Catalogo productos={productos} qInicial={q ?? ""} catInicial={catValida} />;
}