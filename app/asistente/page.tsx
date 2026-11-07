import { obtenerProductos } from "@/lib/datos";
import Asistente from "../components/Asistente";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Asistente por vehículo | Turbo Universal",
  description: "Encuentra el turbo ideal para tu vehículo en 3 pasos.",
};

export default async function PaginaAsistente() {
  const productos = await obtenerProductos();
  return <Asistente productos={productos} />;
}