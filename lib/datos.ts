import { productos as catalogo, type Producto } from "@/data/productos";
import { productosDePrueba } from "@/data/productos-prueba";
import { supabase } from "./supabase";
import { API_URL, ErrorApi, pedirApi } from "./api";

type Fila = {
  referencia: string;
  nombre: string;
  marca: string;
  categoria: string;
  vehiculos: string[] | null;
  precio: number | null;
  stock: number | null;
  imagen: string | null;
  oem?: string[] | null; // puede faltar si la base aún no tiene la columna
  garantia?: string | null;
};

const mapear = (f: Fila) => ({
  referencia: f.referencia,
  nombre: f.nombre,
  marca: f.marca,
  categoria: f.categoria,
  vehiculos: f.vehiculos ?? [],
  precio: f.precio ?? null,
  stock: f.stock ?? null,
  imagen: f.imagen ?? undefined,
  oem: f.oem ?? [],
  garantia: f.garantia ?? undefined,
});

// Respaldo local: el catálogo real. Las pruebas e2e y el CI usan datos de prueba con precio y
// stock fijos (PRODUCTOS_DE_PRUEBA=1, sin Supabase ni API) para probar las reglas de negocio.
const locales: Producto[] = process.env.PRODUCTOS_DE_PRUEBA === "1" ? productosDePrueba : catalogo;

// Orden: 1) API en Render  2) Supabase directo  3) datos locales.
// La API tiene 1,5 s para responder; despierta normalmente responde en menos de 0,5 s.
// Si está dormida (plan gratis de Render: ~50 s en despertar), la página usa Supabase
// y no deja esperando al cliente. El flujo .github/workflows/despertar-api.yml la mantiene despierta.
const LECTURA = { espera: 1500, next: { revalidate: 60, tags: ["productos"] } };

export async function obtenerProductos(): Promise<Producto[]> {
  if (API_URL) {
    try {
      return (await pedirApi<Fila[]>("/productos", LECTURA)).map(mapear);
    } catch (e) {
      console.warn("API no disponible, leyendo Supabase:", (e as Error).message);
    }
  }
  return productosSupabase();
}

async function productosSupabase(): Promise<Producto[]> {
  if (!supabase) return locales;
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("referencia");
  if (error || !data) {
    console.error("Error leyendo Supabase:", error?.message);
    return locales;
  }
  return (data as Fila[]).map(mapear);
}
 
export async function obtenerProducto(referencia: string): Promise<Producto | undefined> {
  if (API_URL) {
    try {
      return mapear(await pedirApi<Fila>(`/productos/${encodeURIComponent(referencia)}`, LECTURA));
    } catch (e) {
      if (e instanceof ErrorApi && e.estado === 404) return undefined;
      console.warn("API no disponible, leyendo Supabase:", (e as Error).message);
    }
  }
  if (!supabase) return locales.find((p) => p.referencia === referencia);
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("referencia", referencia)
    .maybeSingle();
  if (error) {
    console.error("Error leyendo Supabase:", error.message);
    return locales.find((p) => p.referencia === referencia);
  }
  return data ? mapear(data as Fila) : undefined;
}