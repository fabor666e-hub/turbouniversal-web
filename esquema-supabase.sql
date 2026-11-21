-- Esquema de Turbo Universal en Supabase (copiado de producción, proyecto "turboman").
-- Uso: Supabase → proyecto turboman-dev → SQL Editor → pegar y ejecutar (Run).
-- Crea las 3 tablas, sus políticas RLS y los 12 productos de ejemplo.

create table if not exists public.productos (
  referencia text primary key,
  nombre text not null,
  marca text not null default 'Turboman',
  categoria text not null,
  vehiculos text[] not null default '{}',
  precio integer not null default 0,
  stock integer not null default 0,
  imagen text,
  creado_en timestamptz default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  tipo text not null,
  detalle text,
  ruta text,
  creado_en timestamptz default now()
);

create table if not exists public.cotizaciones (
  id bigint generated always as identity primary key,
  nombre text not null,
  telefono text not null,
  items jsonb not null,
  total integer not null,
  creado_en timestamptz default now()
);

-- RLS: el visitante solo lee productos y solo inserta eventos y cotizaciones.
-- Todo lo demás (panel, administrador) usa la clave secreta en el servidor.
alter table public.productos enable row level security;
alter table public.eventos enable row level security;
alter table public.cotizaciones enable row level security;

drop policy if exists "Lectura publica de productos" on public.productos;
create policy "Lectura publica de productos" on public.productos for select using (true);

drop policy if exists "Registrar eventos" on public.eventos;
create policy "Registrar eventos" on public.eventos for insert to anon with check (true);

drop policy if exists "Registrar cotizaciones" on public.cotizaciones;
create policy "Registrar cotizaciones" on public.cotizaciones for insert to anon with check (true);

-- Si la API (TypeORM) crea la tabla "migrations" en este proyecto, protegerla también:
-- alter table public.migrations enable row level security;
-- revoke all on table public.migrations from anon, authenticated;

insert into public.productos (referencia, nombre, marca, categoria, vehiculos, precio, stock) values
  ('TB-1001', 'Turboalimentador CAT 3116', 'Turboman', 'turboalimentadores', '{"Caterpillar 3116","Maquinaria pesada"}', 2850000, 6),
  ('TB-1002', 'Turboalimentador HX35', 'Turboman', 'turboalimentadores', '{"Chevrolet NPR","Kenworth"}', 2400000, 2),
  ('TB-1003', 'Turboalimentador GT1749V', 'Turboman', 'turboalimentadores', '{"Renault Duster","Nissan Frontier"}', 1950000, 0),
  ('TB-2001', 'Cartridge HX35', 'Turboman', 'cartridge', '{"Chevrolet NPR","Kenworth"}', 780000, 12),
  ('TB-2002', 'Cartridge GT1749V', 'Turboman', 'cartridge', '{"Renault Duster"}', 690000, 3),
  ('TB-3001', 'Kit de reparación HX35', 'Turboman', 'kit-reparacion', '{"Chevrolet NPR"}', 190000, 25),
  ('TB-3002', 'Kit de reparación CAT 3116', 'Turboman', 'kit-reparacion', '{"Caterpillar 3116"}', 230000, 8),
  ('TB-4001', 'Conjunto rotor HX35', 'Turboman', 'conjunto-rotor', '{"Chevrolet NPR","Kenworth"}', 420000, 5),
  ('TB-5001', 'Actuador electrónico GT1749V', 'Turboman', 'actuador-electronico', '{"Renault Duster","Nissan Frontier"}', 860000, 1),
  ('TB-6001', 'Geometría variable GT1749V', 'Turboman', 'geometria-variable', '{"Renault Duster"}', 540000, 7),
  ('TB-7001', 'Caracol de admisión HX35', 'Turboman', 'caracol-admision', '{"Chevrolet NPR"}', 480000, 4),
  ('TB-8001', 'Caracol de escape HX35', 'Turboman', 'caracol-escape', '{"Chevrolet NPR","Kenworth"}', 510000, 0)
on conflict (referencia) do nothing;

notify pgrst, 'reload schema';
