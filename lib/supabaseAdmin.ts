import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// SOLO se usa en el servidor (nunca importes este archivo en un componente "use client")
export const supabaseAdmin =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;