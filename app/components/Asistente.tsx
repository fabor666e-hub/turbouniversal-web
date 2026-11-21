"use client";

import { useMemo, useState } from "react";
import { categorias, type Producto } from "@/data/productos";
import { registrar } from "@/lib/rastreo";
import { NUMERO_WHATSAPP } from "@/lib/utils";
import { TarjetaProducto } from "./Comunes";

const ROJO = "#e8233b";
const AZUL = "#1a2150";

// "Chevrolet NPR" -> marca "Chevrolet", modelo "NPR"
function partir(v: string) {
  const [marca, ...resto] = v.trim().split(" ");
  return { marca, modelo: resto.join(" ") || "Todos los modelos" };
}

function Opcion({
  texto,
  onClick,
  i,
}: {
  texto: string;
  onClick: () => void;
  i: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${i * 40}ms`, borderLeftColor: i % 2 === 0 ? ROJO : AZUL }}
      className="animate-[aparecer_0.4s_ease_both] rounded-lg border border-slate-200 border-l-4 bg-white p-5 text-left text-lg font-semibold text-[#1a2150] transition duration-200 hover:border-[#1a2150] hover:bg-[#1a2150] hover:text-white"
    >
      {texto}
    </button>
  );
}

export default function Asistente({ productos }: { productos: Producto[] }) {
  const [paso, setPaso] = useState(1);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState(""); // slug de categoría, "" = todos

  // Paso 1: marcas que existen en los datos reales
  const marcas = useMemo(() => {
    const s = new Set<string>();
    productos.forEach((p) => p.vehiculos.forEach((v) => s.add(partir(v).marca)));
    return [...s].sort();
  }, [productos]);

  // Paso 2: modelos de la marca elegida
  const modelos = useMemo(() => {
    const s = new Set<string>();
    productos.forEach((p) =>
      p.vehiculos.forEach((v) => {
        const x = partir(v);
        if (x.marca === marca) s.add(x.modelo);
      })
    );
    return [...s].sort();
  }, [productos, marca]);

  // Productos compatibles con marca + modelo
  const compatibles = useMemo(
    () =>
      productos.filter((p) =>
        p.vehiculos.some((v) => {
          const x = partir(v);
          return x.marca === marca && x.modelo === modelo;
        })
      ),
    [productos, marca, modelo]
  );

  // Paso 3: tipos de repuesto disponibles para ese vehículo
  const tipos = useMemo(
    () => categorias.filter((c) => compatibles.some((p) => p.categoria === c.slug)),
    [compatibles]
  );

  const resultado = tipo ? compatibles.filter((p) => p.categoria === tipo) : compatibles;
  const vehiculoTexto = `${marca} ${modelo === "Todos los modelos" ? "" : modelo}`.trim();

  const elegirMarca = (m: string) => {
    registrar("asistente", `marca:${m}`);
    setMarca(m);
    setModelo("");
    setTipo("");
    setPaso(2);
  };
  const elegirModelo = (m: string) => {
    registrar("asistente", `modelo:${marca} ${m}`);
    setModelo(m);
    setPaso(3);
  };
  const elegirTipo = (slug: string) => {
    registrar("asistente", `tipo:${slug || "todos"}`);
    setTipo(slug);
    setPaso(4);
  };
  const atras = () => {
    if (paso === 4) setTipo("");
    if (paso === 3) setModelo("");
    if (paso === 2) setMarca("");
    setPaso((p) => Math.max(1, p - 1));
  };
  const reiniciar = () => {
    setPaso(1);
    setMarca("");
    setModelo("");
    setTipo("");
  };

  const linkWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(
    `Hola, busco un turbo para mi vehículo: ${vehiculoTexto}. ¿Me pueden ayudar?`
  )}`;

  const titulos = [
    "",
    "¿De qué marca es tu vehículo?",
    `¿Qué modelo de ${marca}?`,
    "¿Qué tipo de repuesto buscas?",
    "Esto es lo que encontramos",
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <style>{`@keyframes aparecer{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      <h1 className="text-3xl font-bold text-[#1a2150]">
        Asistente por <span className="text-[#e8233b]">vehículo</span>
      </h1>
      <p className="mt-2 text-slate-500">Responde 3 preguntas y te mostramos el turbo que le sirve a tu carro.</p>

      {/* Barra de progreso */}
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#e8233b] transition-all duration-500"
          style={{ width: `${(Math.min(paso, 4) / 4) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">Paso {Math.min(paso, 3)} de 3</p>

      <h2 className="mt-8 text-2xl font-bold text-[#1a2150]">{titulos[paso]}</h2>

      <div key={paso} className="mt-6">
        {paso === 1 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {marcas.map((m, i) => (
              <Opcion key={m} texto={m} i={i} onClick={() => elegirMarca(m)} />
            ))}
          </div>
        )}

        {paso === 2 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {modelos.map((m, i) => (
              <Opcion key={m} texto={m} i={i} onClick={() => elegirModelo(m)} />
            ))}
          </div>
        )}

        {paso === 3 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Opcion texto="Ver todos" i={0} onClick={() => elegirTipo("")} />
            {tipos.map((c, i) => (
              <Opcion key={c.slug} texto={c.nombre} i={i + 1} onClick={() => elegirTipo(c.slug)} />
            ))}
          </div>
        )}

        {paso === 4 &&
          (resultado.length > 0 ? (
            <>
              <p className="mb-4 text-slate-500">
                {resultado.length} resultado{resultado.length > 1 ? "s" : ""} para{" "}
                <b className="text-[#1a2150]">{vehiculoTexto}</b>
              </p>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {resultado.map((p) => (
                  <TarjetaProducto key={p.referencia} p={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-[#1a2150]">
                Aún no tenemos ese repuesto en la web para {vehiculoTexto}.
              </p>
              <p className="mt-2 text-slate-500">Escríbenos y un asesor te ayuda a encontrarlo.</p>
              <a
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                data-track="asistente_whatsapp"
                className="mt-5 inline-block rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Preguntar por WhatsApp
              </a>
            </div>
          ))}
      </div>

      <div className="mt-10 flex gap-3">
        {paso > 1 && (
          <button
            onClick={atras}
            className="rounded-md border-2 border-[#1a2150] px-5 py-2 text-sm font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
          >
            ← Atrás
          </button>
        )}
        {paso > 1 && (
          <button
            onClick={reiniciar}
            className="rounded-md bg-[#e8233b] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-90"
          >
            Empezar de nuevo
          </button>
        )}
      </div>
    </main>
  );
}