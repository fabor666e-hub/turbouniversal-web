"use client";

import { useEffect, useRef, useState } from "react";

type Paso = {
  titulo: string;
  texto: string;
  etiqueta: string;
  src?: string; // ruta de la foto en /public, ej: "/nosotros-1.jpg"
};

// EDITA estos textos y agrega las fotos reales cuando las tengas
const pasos: Paso[] = [
  {
    etiqueta: "Quiénes somos",
    titulo: "Importadora Turbo Universal",
    texto:
      "Somos una empresa colombiana especializada en la comercialización y distribución de turboalimentadores y repuestos para sistemas de turbo.",
  },
  {
    etiqueta: "Turboman",
    titulo: "Calidad de equipo original",
    texto:
      "Turboman es nuestra marca registrada en Colombia de turboalimentadores completos con calidad de equipo original.",
  },
  {
    etiqueta: "Cobertura",
    titulo: "Para cualquier tipo de vehículo",
    texto:
      "Vehículos agrícolas, maquinaria pesada y cualquier tipo de vehículo: encuentra el turbo que necesitas por referencia, marca o vehículo.",
  },
  {
    etiqueta: "Cotiza fácil",
    titulo: "Rápido y sin complicaciones",
    texto:
      "Arma tu cotización en línea, revisa la disponibilidad de cada producto y envíala directo a un asesor por WhatsApp.",
  },
];

function Imagen({ paso, i }: { paso: Paso; i: number }) {
  if (paso.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={paso.src} alt={paso.titulo} className="h-full w-full object-cover" />
    );
  }
  // Relleno mientras no haya foto: alterna azul y rojo de la marca
  const fondo =
    i % 2 === 0
      ? "from-[#1a2150] to-[#2a3580]"
      : "from-[#e8233b] to-[#b3162c]";
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${fondo} text-white`}>
      <span className="text-8xl font-extrabold opacity-30">0{i + 1}</span>
      <span className="mt-2 text-sm uppercase tracking-widest text-white/70">Foto aquí</span>
    </div>
  );
}

export default function Nosotros() {
  const [activo, setActivo] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            setActivo(Number((e.target as HTMLElement).dataset.i));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="nosotros" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-2 text-3xl font-extrabold text-[#1a2150]">Nosotros</h2>
        <span className="block h-1 w-16 rounded-full bg-[var(--acento)] transition-colors duration-700" />

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          {/* Textos que van pasando al hacer scroll */}
          <div>
            {pasos.map((p, i) => (
              <div
                key={p.titulo}
                data-i={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex min-h-[70vh] flex-col justify-center"
              >
                {/* Imagen en móvil */}
                <div className="mb-6 aspect-video overflow-hidden rounded-3xl md:hidden">
                  <Imagen paso={p} i={i} />
                </div>
                <div
                  className={`transition-all duration-500 ${
                    activo === i ? "translate-x-0 opacity-100" : "translate-x-4 opacity-30"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-widest text-[var(--acento)]">
                    {p.etiqueta}
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-[#1a2150]">{p.titulo}</h3>
                  <p className="mt-4 text-lg text-slate-600">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Imagen fija que cambia con cada paso */}
          <div className="hidden md:block">
            <div className="sticky top-28 aspect-square overflow-hidden rounded-3xl rounded-br-[6rem] shadow-xl">
              {pasos.map((p, i) => (
                <div
                  key={p.titulo}
                  className={`absolute inset-0 transition-all duration-700 ${
                    activo === i ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                >
                  <Imagen paso={p} i={i} />
                </div>
              ))}
              {/* Indicador de pasos */}
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {pasos.map((p, i) => (
                  <span
                    key={p.titulo}
                    className={`h-2 rounded-full bg-white transition-all duration-500 ${
                      activo === i ? "w-8" : "w-2 opacity-50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}