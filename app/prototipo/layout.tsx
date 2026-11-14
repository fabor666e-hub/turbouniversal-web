import type { ReactNode } from "react";

export const metadata = {
  robots: { index: false, follow: false },
};

// Barra para comparar las variantes de la pantalla principal (bloque 5 · El render)
export default function LayoutPrototipo({ children }: { children: ReactNode }) {
  const variantes = [
    { href: "/prototipo/a", texto: "A · Buscador primero" },
    { href: "/prototipo/b", texto: "B · Catálogo visual" },
    { href: "/prototipo/c", texto: "C · Por vehículo" },
  ];
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm text-amber-900">
        <span className="font-semibold">Prototipo de la pantalla principal:</span>
        {variantes.map((v) => (
          <a key={v.href} href={v.href} className="rounded-full bg-white px-3 py-1 font-medium hover:bg-amber-200">
            {v.texto}
          </a>
        ))}
      </div>
      {children}
    </>
  );
}
