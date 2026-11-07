import { productos as locales, type Producto } from "@/data/productos";
import { supabase } from "./supabase";

type Fila = {
  referencia: string;
  nombre: string;
  marca: string;
  categoria: string;
  vehiculos: string[] | null;
  precio: number;
  stock: number;
  imagen: string | null;
};

const mapear = (f: Fila) => ({
  referencia: f.referencia,
  nombre: f.nombre,
  marca: f.marca,
  categoria: f.categoria,
  vehiculos: f.vehiculos ?? [],
  precio: f.precio,
  stock: f.stock,
  imagen: f.imagen ?? undefined,
});

export async function obtenerProductos(): Promise<Producto[]> {
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