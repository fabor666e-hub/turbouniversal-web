"use client";

import { useState } from "react";
import { registrar } from "@/lib/rastreo";

// Videos de YouTube que la empresa muestra en su sitio actual (turbouniversal.com.co).
// Para cambiar o agregar uno, copia el código que va después de "v=" en el enlace de YouTube.
const VIDEOS = [
  { id: "7sYFZjR8z74", titulo: "¿Qué es un turboalimentador?", canal: "Turbodina SAIC" },
  { id: "lEFiRNWURSQ", titulo: "Turbo simple vs. geometría variable", canal: "AutotecnicaTV" },
  { id: "OwDX2xIvRNA", titulo: "¿Cómo funciona el turbo?", canal: "Hidráulica y neumática" },
  { id: "qNOolgALWBw", titulo: "El turbo de un motor y sus partes", canal: "tuteorica.com" },
];

function Video({ id, titulo, canal }: (typeof VIDEOS)[number]) {
  const [activo, setActivo] = useState(false);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative aspect-video bg-[#11173a]">
        {activo ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            onClick={() => {
              registrar("video", id);
              setActivo(true);
            }}
            aria-label={`Reproducir: ${titulo}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* Miniatura liviana: el reproductor de YouTube solo carga al hacer clic */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#11173a]/70 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d91e34] text-white shadow-lg transition group-hover:bg-[#b8172b]">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug text-[#1a2150]">{titulo}</h3>
        <p className="mt-1 text-sm text-slate-500">{canal}</p>
      </div>
    </article>
  );
}

export default function VideosTurbo() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {VIDEOS.map((v) => (
        <Video key={v.id} {...v} />
      ))}
    </div>
  );
}
