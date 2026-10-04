import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si faltan las claves, queda en null y el sitio usa los datos locales
export const supabase = url && key ? createClient(url, key) : null;