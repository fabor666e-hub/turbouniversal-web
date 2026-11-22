import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { obtenerProductos } from "@/lib/datos";
import Link from "next/link";
import { categorias } from "@/data/productos";
import { sesionValida } from "@/lib/sesionPanel";
import { precio } from "@/lib/utils";
import { hayApi, pedirAdmin } from "@/lib/apiAdmin";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Panel | Turbo Universal",
  robots: { index: false, follow: false },
};

async function entrar(formData: FormData) {
  "use server";
  const clave = process.env.PANEL_CLAVE;
  if (clave && formData.get("clave") === clave) {
    (await cookies()).set("panel", clave, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
  }
  redirect("/panel");
}

async function salir() {
  "use server";
  (await cookies()).delete("panel");
  redirect("/panel");
}

type Evento = { tipo: string; detalle: string | null; creado_en: string };
type Cotizacion = {
  id: number;
  nombre: string;
  telefono: string;
  items: { referencia: string; nombre: string; cantidad: number; precio: number }[];
  total: number;
  creadoEn: string;
};

function contar(eventos: Evento[], tipo: string): [string, number][] {
  const m = new Map<string, number>();
  for (const e of eventos) {
    if (e.tipo === tipo && e.detalle) m.set(e.detalle, (m.get(e.detalle) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

type Filas = [string, number][];
type Datos = {
  fuente: "api" | "supabase";
  totales: { vistas: number; busquedas: number; agregados: number; cotizaciones: number };
  vistas: Filas;
  agregados: Filas;
  busquedas: Filas;
  categorias: Filas;
  clics: Filas;
  stockBajo: { referencia: string; nombre: string; stock: number }[];
  cotizaciones: Cotizacion[];
};

type Top = { valor: string; cantidad: number }[];
const aFilas = (t: Top = []): Filas => t.map((f) => [f.valor, f.cantidad]);

// 1) API en Render: resumen calculado por el backend (GET /api/panel/resumen)
async function datosDesdeApi(): Promise<Datos | null> {
  if (!hayApi()) return null;
  try {
    const [r, cot] = await Promise.all([
      pedirAdmin<{
        totales: Datos["totales"];
        masVistos: Top;
        masAgregados?: Top;
        masBuscados: Top;
        categorias: Top;
        clics: Top;
        stockBajo: Datos["stockBajo"];
      }>("/panel/resumen", { espera: 8000 }),
      pedirAdmin<Cotizacion[]>("/cotizaciones?limite=30", { espera: 8000 }),
    ]);
    return {
      fuente: "api",
      totales: r.totales,
      vistas: aFilas(r.masVistos),
      agregados: aFilas(r.masAgregados),
      busquedas: aFilas(r.masBuscados),
      categorias: aFilas(r.categorias),
      clics: aFilas(r.clics),
      stockBajo: r.stockBajo,
      cotizaciones: cot,
    };
  } catch (e) {
    console.warn("Panel: API no disponible, leyendo Supabase:", (e as Error).message);
    return null;
  }
}

// 2) Respaldo: Supabase directo con la clave de servidor
async function datosDesdeSupabase(): Promise<Datos | null> {
  if (!supabaseAdmin) return null;
  const productos = await obtenerProductos();
  const { data: ev } = await supabaseAdmin
    .from("eventos")
    .select("tipo, detalle, creado_en")
    .order("creado_en", { ascending: false })
    .limit(5000);
  const { data: cot } = await supabaseAdmin
    .from("cotizaciones")
    .select("*")
    .order("creado_en", { ascending: false })
    .limit(30);
  const eventos = (ev ?? []) as Evento[];
  const cotizaciones = ((cot ?? []) as (Omit<Cotizacion, "creadoEn"> & { creado_en: string })[]).map(
    ({ creado_en, ...c }) => ({ ...c, creadoEn: creado_en })
  );
  const total = (tipo: string) => eventos.filter((e) => e.tipo === tipo).length;
  return {
    fuente: "supabase",
    totales: {
      vistas: total("vista_producto"),
      busquedas: total("busqueda"),
      agregados: total("agregar_cotizacion"),
      cotizaciones: cotizaciones.length,
    },
    vistas: contar(eventos, "vista_producto"),
    agregados: contar(eventos, "agregar_cotizacion"),
    busquedas: contar(eventos, "busqueda"),
    categorias: contar(eventos, "categoria"),
    clics: contar(eventos, "clic"),
    // Solo productos con stock conocido (null = a consultar)
    stockBajo: productos
      .flatMap((p) => (p.stock !== null && p.stock <= 3 ? [{ referencia: p.referencia, nombre: p.nombre, stock: p.stock }] : []))
      .sort((a, b) => a.stock - b.stock),
    cotizaciones,
  };
}

function Lista({
  titulo,
  filas,
  vacio,
}: {
  titulo: string;
  filas: [string, number][];
  vacio: string;
}) {
  const max = filas[0]?.[1] ?? 1;
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-bold text-[#1a2150]">{titulo}</h2>
      {filas.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">{vacio}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filas.map(([nombre, n]) => (
            <li key={nombre}>
              <div className="flex justify-between text-sm">
                <span className="truncate pr-2">{nombre}</span>
                <span className="font-semibold">{n}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-[#e8233b]"
                  style={{ width: `${(n / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function Panel() {
  const clave = process.env.PANEL_CLAVE;
  const autorizado = await sesionValida();

  if (!autorizado) {
    return (
      <main className="mx-auto max-w-sm px-8 py-20">
        <h1 className="text-2xl font-bold text-[#1a2150]">Panel privado</h1>
        <form action={entrar} className="mt-6 space-y-3">
          <input
            name="clave"
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#e8233b]"
          />
          <button className="w-full rounded-md bg-[#1a2150] py-3 font-semibold text-white transition hover:bg-[#d91e34]">
            Entrar
          </button>
        </form>
        {!clave && (
          <p className="mt-4 text-sm text-red-600">
            Falta definir PANEL_CLAVE en .env.local y reiniciar el servidor.
          </p>
        )}
      </main>
    );
  }

  const productos = await obtenerProductos();
  const datos = (await datosDesdeApi()) ?? (await datosDesdeSupabase());
  if (!datos) {
    return (
      <main className="mx-auto max-w-xl px-8 py-20">
        <p className="text-red-600">
          No se pudo conectar ni a la API (NEXT_PUBLIC_API_URL) ni a Supabase
          (SUPABASE_SERVICE_ROLE_KEY). Revisa las variables de entorno.
        </p>
      </main>
    );
  }
  const { fuente, totales, cotizaciones } = datos;

  const nombreProducto = (ref: string) => {
    const p = productos.find((x) => x.referencia === ref);
    return p ? `${ref} · ${p.nombre}` : ref;
  };
  const nombreCategoria = (slug: string) =>
    categorias.find((c) => c.slug === slug)?.nombre ?? slug;

  const vistas = datos.vistas.map(([r, n]) => [nombreProducto(r), n] as [string, number]);
  const agregados = datos.agregados.map(([r, n]) => [nombreProducto(r), n] as [string, number]);
  const busquedas = datos.busquedas;
  const cats = datos.categorias.map(([s, n]) => [nombreCategoria(s), n] as [string, number]);
  const clics = datos.clics;
  const stockBajo = datos.stockBajo;

  const resumen = [
    { titulo: "Vistas de productos", valor: totales.vistas },
    { titulo: "Búsquedas", valor: totales.busquedas },
    { titulo: "Agregados a cotización", valor: totales.agregados },
    { titulo: "Cotizaciones enviadas", valor: totales.cotizaciones },
  ];

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a2150]">Panel de datos</h1>
          <p className="mt-1 text-xs text-slate-500">
            Datos obtenidos de:{" "}
            <span className="font-semibold">
              {fuente === "api" ? "API en Render → Supabase" : "Supabase directo (la API no respondió)"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/panel/productos"
            className="rounded-md bg-[#d91e34] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-90"
          >
            Administrar productos
          </Link>
          <form action={salir}>
            <button className="text-sm font-semibold text-slate-500 underline hover:text-[#e8233b]">
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resumen.map((r) => (
          <div key={r.titulo} className="rounded-lg bg-[#1a2150] p-6 text-white">
            <p className="text-4xl font-bold">{r.valor}</p>
            <p className="mt-1 text-sm text-white/70">{r.titulo}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Lista titulo="Productos más vistos" filas={vistas} vacio="Aún no hay vistas." />
        <Lista titulo="Más agregados a la cotización" filas={agregados} vacio="Aún no hay datos." />
        <Lista titulo="Lo que más buscan" filas={busquedas} vacio="Aún no hay búsquedas." />
        <Lista titulo="Categorías más consultadas" filas={cats} vacio="Aún no hay datos." />
        <Lista titulo="Clics por botón" filas={clics} vacio="Aún no hay clics." />

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="font-bold text-[#1a2150]">Stock bajo (3 o menos)</h2>
          {stockBajo.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">Todo el stock está bien.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {stockBajo.map((p) => (
                <li key={p.referencia} className="flex justify-between">
                  <span className="truncate pr-2">{p.referencia} · {p.nombre}</span>
                  <span
                    className={`font-semibold ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}
                  >
                    {p.stock === 0 ? "Agotado" : `${p.stock} und.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-[#1a2150]">Últimas cotizaciones</h2>
          {cotizaciones.length > 0 && (
            <a
              href="/panel/exportar"
              download
              className="rounded-md border-2 border-[#1a2150] px-4 py-2 text-sm font-semibold text-[#1a2150] transition hover:bg-[#1a2150] hover:text-white"
            >
              Descargar para Excel (CSV)
            </a>
          )}
        </div>
        {cotizaciones.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Aún no hay cotizaciones.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="pr-4">Cliente</th>
                  <th className="pr-4">Teléfono</th>
                  <th className="pr-4">Productos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones.map((c) => (
                  <tr key={c.id} className="border-t align-top">
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {new Date(c.creadoEn).toLocaleString("es-CO", {
                        timeZone: "America/Bogota",
                      })}
                    </td>
                    <td className="pr-4">{c.nombre}</td>
                    <td className="pr-4">{c.telefono}</td>
                    <td className="pr-4">
                      {c.items.map((i) => `${i.cantidad} x ${i.nombre}`).join(", ")}
                    </td>
                    <td className="whitespace-nowrap font-semibold">{precio(c.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}