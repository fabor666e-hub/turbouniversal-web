import Link from "next/link";
import BuscadorHero from "./components/BuscadorHero";

export const metadata = {
  title: "Página no encontrada | Turbo Universal",
  robots: { index: false },
};

export default function NoEncontrada() {
  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#1a2150] via-[#1a2150] to-[#2a3580] px-6 pb-28 pt-16 text-white"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-8xl font-extrabold text-[#e8233b] md:text-9xl">404</p>
          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Esta página se quedó sin turbo
          </h1>
          <p className="mt-3 text-lg text-white/70">
            La dirección no existe o el producto ya no está disponible. Busca tu repuesto aquí:
          </p>
          <BuscadorHero />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 text-center">
        <p className="mb-6 font-semibold text-[#1a2150]">O ve directo a:</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#1a2150] px-6 py-3 font-semibold text-white transition hover:bg-[#e8233b]"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="rounded-full bg-[#e8233b] px-6 py-3 font-semibold text-white transition hover:brightness-90"
          >
            Catálogo de productos
          </Link>
          <Link
            href="/asistente"
            className="rounded-full border-2 border-[#1a2150] px-6 py-3 font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
          >
            Asistente por vehículo
          </Link>
        </div>
      </section>
    </>
  );
}
