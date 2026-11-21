"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { categorias } from "@/data/productos";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sesionValida } from "@/lib/sesionPanel";
import { ErrorApi } from "@/lib/api";
import { hayApi, pedirAdmin } from "@/lib/apiAdmin";

export type Estado = { error?: string };

type Fila = {
  referencia: string;
  nombre: string;
  marca: string;
  categoria: string;
  vehiculos: string[];
  precio: number;
  stock: number;
  imagen: string | null;
};

// Toda acción empieza aquí: sin sesión del panel no se escribe nada.
async function verificarSesion() {
  if (!(await sesionValida())) throw new Error("Sesión del panel no válida.");
}

function cliente() {
  if (!supabaseAdmin) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY.");
  return supabaseAdmin;
}

// Las escrituras pasan por la API (Render), que guarda en Supabase.
// Devuelve:
//  - "api"      → la API hizo el cambio
//  - "directo"  → la API no está configurada o no se pudo conectar: usar Supabase directo
//  - { error }  → la API rechazó los datos o tardó demasiado (no se repite en Supabase
//                 para no duplicar el cambio)
type Resultado = "api" | "directo" | { error: string };

async function porApi(ruta: string, init: RequestInit): Promise<Resultado> {
  if (!hayApi()) return "directo";
  try {
    await pedirAdmin(ruta, init);
    return "api";
  } catch (e) {
    if (!(e instanceof ErrorApi)) return "directo";
    if (e.codigo === "TIEMPO_AGOTADO")
      return { error: "La API está despertando (plan gratis de Render). Espera unos segundos e intenta de nuevo." };
    if (e.estado === 0 || e.estado >= 500 || e.estado === 401) {
      console.warn("API no disponible para el panel, usando Supabase:", e.message);
      return "directo";
    }
    if (e.codigo === "REFERENCIA_DUPLICADA") return { error: "Ya existe un producto con esa referencia." };
    if (e.codigo === "NO_ENCONTRADO") return { error: "El producto ya no existe. Vuelve a la lista." };
    return { error: e.message };
  }
}

const json = (cuerpo: unknown) => JSON.stringify(cuerpo);

// "2.850.000", "2850000" o "2 850 000" -> 2850000. Devuelve null si no es un entero >= 0.
function entero(valor: FormDataEntryValue | null): number | null {
  const t = String(valor ?? "").trim();
  if (!/^\d[\d.,\s]*$/.test(t)) return null;
  const n = Number(t.replace(/[.,\s]/g, ""));
  return Number.isSafeInteger(n) && n >= 0 ? n : null;
}

function leerFormulario(fd: FormData): { fila?: Fila; error?: string } {
  const referencia = String(fd.get("referencia") ?? "").trim().toUpperCase();
  const nombre = String(fd.get("nombre") ?? "").trim();
  const marca = String(fd.get("marca") ?? "").trim();
  const categoria = String(fd.get("categoria") ?? "").trim();
  const imagen = String(fd.get("imagen") ?? "").trim();
  const precio = entero(fd.get("precio"));
  const stock = entero(fd.get("stock"));
  const vehiculos = [
    ...new Set(
      String(fd.get("vehiculos") ?? "")
        .split(/\r?\n/)
        .map((v) => v.trim().replace(/\s+/g, " "))
        .filter(Boolean)
    ),
  ];

  if (!/^[A-Z0-9][A-Z0-9-]{1,29}$/.test(referencia))
    return { error: "La referencia es obligatoria: de 2 a 30 caracteres, solo letras, números y guiones." };
  if (nombre.length < 3 || nombre.length > 120)
    return { error: "El nombre debe tener entre 3 y 120 caracteres." };
  if (!marca) return { error: "Escribe la marca." };
  if (!categorias.some((c) => c.slug === categoria)) return { error: "Elige una categoría." };
  if (precio === null) return { error: "El precio debe ser un número entero sin decimales (ej. 2850000)." };
  if (stock === null) return { error: "El stock debe ser un número entero de 0 en adelante." };
  if (vehiculos.some((v) => !v.includes(" ")))
    return { error: 'Cada vehículo va en su propia línea con el formato "Marca Modelo" (ej. Chevrolet NPR).' };

  return {
    fila: { referencia, nombre, marca, categoria, vehiculos, precio, stock, imagen: imagen || null },
  };
}

function actualizarSitio() {
  // Las páginas públicas leen datos frescos; esto refresca también el panel.
  updateTag("productos");
  revalidatePath("/", "layout");
}

export async function crearProducto(_prev: Estado, fd: FormData): Promise<Estado> {
  await verificarSesion();
  const { fila, error } = leerFormulario(fd);
  if (!fila) return { error };

  const r = await porApi("/productos", { method: "POST", body: json(fila) });
  if (typeof r === "object") return r;
  if (r === "directo") {
    const { error: e } = await cliente().from("productos").insert(fila);
    if (e) {
      if (e.code === "23505") return { error: `Ya existe un producto con la referencia ${fila.referencia}.` };
      return { error: `No se pudo guardar: ${e.message}` };
    }
  }
  actualizarSitio();
  redirect(`/panel/productos?ok=creado&ref=${encodeURIComponent(fila.referencia)}`);
}

export async function editarProducto(
  referenciaOriginal: string,
  _prev: Estado,
  fd: FormData
): Promise<Estado> {
  await verificarSesion();
  const { fila, error } = leerFormulario(fd);
  if (!fila) return { error };

  // La API no deja cambiar la referencia en PUT: si cambió, se crea con la nueva y se borra la anterior.
  const { referencia, ...cambios } = fila;
  const r =
    referencia === referenciaOriginal
      ? await porApi(`/productos/${encodeURIComponent(referencia)}`, { method: "PUT", body: json(cambios) })
      : await (async (): Promise<Resultado> => {
          const creado = await porApi("/productos", { method: "POST", body: json(fila) });
          if (creado !== "api") return creado;
          return porApi(`/productos/${encodeURIComponent(referenciaOriginal)}`, { method: "DELETE" });
        })();
  if (typeof r === "object") return r;
  if (r === "api") {
    actualizarSitio();
    redirect(`/panel/productos?ok=editado&ref=${encodeURIComponent(fila.referencia)}`);
  }

  const { data, error: e } = await cliente()
    .from("productos")
    .update(fila)
    .eq("referencia", referenciaOriginal)
    .select("referencia");
  if (e) {
    if (e.code === "23505") return { error: `Ya existe otro producto con la referencia ${fila.referencia}.` };
    return { error: `No se pudo guardar: ${e.message}` };
  }
  if (!data || data.length === 0) return { error: "El producto ya no existe. Vuelve a la lista." };

  actualizarSitio();
  redirect(`/panel/productos?ok=editado&ref=${encodeURIComponent(fila.referencia)}`);
}

export async function cambiarStock(fd: FormData) {
  await verificarSesion();
  const referencia = String(fd.get("referencia") ?? "");
  const delta = Number(fd.get("delta"));
  if (!referencia || ![1, -1].includes(delta)) return;

  const r = await porApi(`/productos/${encodeURIComponent(referencia)}/stock`, {
    method: "PATCH",
    body: json({ delta }),
  });
  if (r !== "directo") return actualizarSitio();

  const db = cliente();
  const { data } = await db.from("productos").select("stock").eq("referencia", referencia).maybeSingle();
  if (!data) return;
  const nuevo = Math.max(0, (data.stock as number) + delta);
  await db.from("productos").update({ stock: nuevo }).eq("referencia", referencia);
  actualizarSitio();
}

export async function borrarProducto(fd: FormData) {
  await verificarSesion();
  const referencia = String(fd.get("referencia") ?? "");
  if (!referencia) return;
  const r = await porApi(`/productos/${encodeURIComponent(referencia)}`, { method: "DELETE" });
  if (r === "directo") await cliente().from("productos").delete().eq("referencia", referencia);
  actualizarSitio();
  redirect(`/panel/productos?ok=borrado&ref=${encodeURIComponent(referencia)}`);
}
