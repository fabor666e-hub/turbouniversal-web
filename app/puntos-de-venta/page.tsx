import { Reveal } from "../components/Comunes";
import { NUMERO_WHATSAPP } from "@/lib/utils";
import { IconoUbicacion, IconoWhatsApp } from "../components/Iconos";

export const metadata = {
  title: "Puntos de venta | Turbo Universal",
  description:
    "Encuentra nuestras sedes de Turbo Universal: dirección, horarios y cómo llegar.",
};

// EDITA estos datos con la información real de la empresa.
// Para agregar otra sede, copia un bloque { ... } completo dentro de la lista.
// "telefono" es opcional: si una sede no tiene, no se muestra.
type Sede = {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono?: string;
  horarios: string[];
};

const sedes: Sede[] = [
  {
    nombre: "Sede principal",
    direccion: "Calle 7 No. 16-22, La Estanzuela",
    ciudad: "Bogotá",
    telefono: "322 449 4190",
    horarios: [
      "Lunes a viernes: 8:00 a. m. a 6:00 p. m.",
      "Sábados: 8:00 a. m. a 1:00 p. m.",
    ],
  },
  {
    nombre: "Sede Medellín",
    direccion: "Calle 45A No. 59-52, Barrio Triste",
    ciudad: "Medellín",
    telefono: "304 317 3143",
    horarios: [
      "Lunes a viernes: 8:00 a. m. a 6:00 p. m.",
      "Sábados: 8:00 a. m. a 1:00 p. m.",
    ],
  },
  {
    nombre: "Sede Cali",
    direccion: "Calle 34 No. 3-33, local 101, Tecnicentro Santamónica",
    ciudad: "Cali, Valle del Cauca",
    horarios: ["Escríbenos por WhatsApp para confirmar el horario."],
  },
  {
    nombre: "Sede Duitama",
    direccion: "Carrera 42 No. 14-33, Sevilla 2, Autopista Central del Norte",
    ciudad: "Duitama, Boyacá",
    horarios: ["Escríbenos por WhatsApp para confirmar el horario."],
  },
];

export default function PuntosDeVenta() {
  return (
    <main>
      {/* Encabezado */}
      <section
        className="bg-gradient-to-br from-[#1a2150] via-[#1a2150] to-[#2a3580] px-6 pb-20 pt-14 text-center text-white"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)" }}
      >
        <Reveal>
          <h1 className="text-4xl font-extrabold md:text-5xl">Puntos de venta</h1>
          <p className="mt-3 text-lg text-white/70">
            Visítanos o escríbenos para cotizar tu turbo
          </p>
        </Reveal>
      </section>

      {/* Sedes */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:px-8 md:grid-cols-2">
        {sedes.map((s) => {
          const consulta = `${s.direccion}, ${s.ciudad}, Colombia`;
          return (
            <Reveal key={s.nombre} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-3xl rounded-br-[5rem] bg-white shadow-lg">
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-extrabold text-[#1a2150] md:text-3xl">{s.nombre}</h2>
                  <span className="mx-auto mt-2 block h-1 w-16 rounded-full bg-[#e8233b]" />

                  <p className="mt-6 text-lg font-semibold text-slate-700">
                    {s.direccion}
                  </p>
                  <p className="text-slate-500">{s.ciudad}, Colombia</p>
                  {s.telefono && (
                    <a
                      href={`tel:+57${s.telefono.replace(/\s/g, "")}`}
                      className="mt-2 inline-block font-semibold text-[#1a2150] hover:text-[#e8233b]"
                    >
                      Tel. {s.telefono}
                    </a>
                  )}

                  <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#e8233b]">
                    Horario
                  </p>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    {s.horarios.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consulta)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#1a2150] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e8233b]"
                    >
                      <IconoUbicacion className="h-4 w-4" />
                      Cómo llegar
                    </a>
                    <a
                      href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(`Hola, quiero información sobre la ${s.nombre} (${s.ciudad}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-green-700 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
                    >
                      <IconoWhatsApp className="h-4 w-4" />
                      Escribir por WhatsApp
                    </a>
                  </div>
                </div>

                {/* Mapa de Google */}
                <iframe
                  title={`Mapa de ${s.nombre}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`}
                  className="mt-auto h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </article>
            </Reveal>
          );
        })}
      </section>
    </main>
  );
}