-- Esquema de Turbo Universal en Supabase (copiado de producción, proyecto "turboman").
-- Uso: Supabase → proyecto turboman-dev → SQL Editor → pegar y ejecutar (Run).
-- Crea las 3 tablas, sus políticas RLS y los turbos del catálogo de la empresa (precio y stock a consultar).

create table if not exists public.productos (
  referencia text primary key,
  nombre text not null,
  marca text not null default 'Turboman',
  categoria text not null,
  vehiculos text[] not null default '{}',
  precio integer,  -- null = precio a consultar
  stock integer,   -- null = disponibilidad a consultar
  imagen text,
  oem text[] not null default '{}',
  garantia text,
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
  ('JF-158', 'Turbo Land Rover Evoque K03', 'Turboman', 'turboalimentadores', ARRAY['Land Rover Evoque']::text[], null, null),
  ('JF-027', 'Turbo NPR 3.5 modelo 1995', 'Turboman', 'turboalimentadores', ARRAY['Chevrolet NPR 3.5']::text[], null, null),
  ('JF-093', 'Turbo LUV D-Max 2.5', 'Turboman', 'turboalimentadores', ARRAY['Chevrolet LUV D-Max 2.5']::text[], null, null),
  ('JF-018', 'Turbo Mazda T 4.5', 'Turboman', 'turboalimentadores', ARRAY['Mazda T 4.5']::text[], null, null),
  ('JF-153', 'Turbo Perkins 210 DTI', 'Turboman', 'turboalimentadores', ARRAY['Perkins 210 DTI']::text[], null, null),
  ('JF-063', 'Turbo Perkins Pajarita GT2556S', 'Turboman', 'turboalimentadores', ARRAY['Perkins Pajarita']::text[], null, null),
  ('JF-154', 'Turbo Perkins 1006T', 'Turboman', 'turboalimentadores', ARRAY['Perkins 1006T']::text[], null, null),
  ('JF-008', 'Turbo Perkins Pajarita', 'Turboman', 'turboalimentadores', ARRAY['Perkins Pajarita']::text[], null, null),
  ('JF-009', 'Turbo Perkins Pajarita', 'Turboman', 'turboalimentadores', ARRAY['Perkins Pajarita']::text[], null, null),
  ('JF-011', 'Turbo Perkins Pajarita', 'Turboman', 'turboalimentadores', ARRAY['Perkins Pajarita']::text[], null, null),
  ('JF-057', 'Turbo Toyota Super Delta CT12B', 'Turboman', 'turboalimentadores', ARRAY['Toyota Super Delta']::text[], null, null),
  ('JF-039', 'Turbo Toyota Vigo 2.5 CT16 completo homologado', 'Turboman', 'turboalimentadores', ARRAY['Toyota Vigo 2.5']::text[], null, null),
  ('JF-148', 'Turbo Cummins 6CT manguera HX40/H1E sin pestaña', 'Turboman', 'turboalimentadores', ARRAY['Cummins 6CT']::text[], null, null),
  ('JF-070', 'Turbo Cummins 6BT AA', 'Turboman', 'turboalimentadores', ARRAY['Cummins 6BT']::text[], null, null),
  ('JF-150', 'Turbo Caterpillar 3116 sin válvula', 'Turboman', 'turboalimentadores', ARRAY['Caterpillar 3116']::text[], null, null),
  ('JF-092', 'Turbo Cummins 4BT 3.9 L HX30W', 'Turboman', 'turboalimentadores', ARRAY['Cummins 4BT 3.9']::text[], null, null),
  ('JF-032', 'Turbo Cummins 6BT-160 HX35/H1C', 'Turboman', 'turboalimentadores', ARRAY['Cummins 6BT-160']::text[], null, null),
  ('JF-069', 'Turbo Cummins 4BTA Case New Holland Elite', 'Turboman', 'turboalimentadores', ARRAY['Cummins 4BTA', 'Case New Holland']::text[], null, null),
  ('JF-017', 'Turbo Cummins 6BT-180 H1C plato separado', 'Turboman', 'turboalimentadores', ARRAY['Cummins 6BT-180']::text[], null, null),
  ('JF-059', 'Turbo Cummins 6BT-190 HX35W', 'Turboman', 'turboalimentadores', ARRAY['Cummins 6BT-190']::text[], null, null),
  ('JF-071', 'Turbo Cummins 6BT pestaña HX35', 'Turboman', 'turboalimentadores', ARRAY['Cummins 6BT']::text[], null, null),
  ('JF-155', 'Turbo Cummins KTA 19', 'Turboman', 'turboalimentadores', ARRAY['Cummins KTA 19']::text[], null, null),
  ('JF-058', 'Turbo Cummins QSB 3.8', 'Turboman', 'turboalimentadores', ARRAY['Cummins QSB 3.8']::text[], null, null),
  ('JF-073', 'Turbo Cummins M11/L10-300 HX50', 'Turboman', 'turboalimentadores', ARRAY['Cummins M11', 'Cummins L10-300']::text[], null, null),
  ('JF-078', 'Turbo Foton BJ49 2.8 L GT22', 'Turboman', 'turboalimentadores', ARRAY['Foton BJ49 2.8']::text[], null, null),
  ('JF-157', 'Turbo Ford Escape / Focus', 'Turboman', 'turboalimentadores', ARRAY['Ford Escape', 'Ford Focus']::text[], null, null),
  ('JF-149', 'Turbo Hitachi EX200 motor 6BD1', 'Turboman', 'turboalimentadores', ARRAY['Hitachi EX200', 'Isuzu 6BD1']::text[], null, null),
  ('JF-061', 'Turbo Nissan Frontier NP300', 'Turboman', 'turboalimentadores', ARRAY['Nissan Frontier NP300']::text[], null, null),
  ('JF-026', 'Turbo Isuzu NPR 3.9 modelo 1998', 'Turboman', 'turboalimentadores', ARRAY['Isuzu NPR 3.9']::text[], null, null),
  ('JF-077', 'Turbo FTR IHI', 'Turboman', 'turboalimentadores', ARRAY['Chevrolet FTR']::text[], null, null),
  ('JF-147', 'Turbo Hyundai H100 Grand Starex GT1749', 'Turboman', 'turboalimentadores', ARRAY['Hyundai H100', 'Hyundai Grand Starex']::text[], null, null),
  ('JF-030', 'Turbo Isuzu NKR-NHR I, II y III', 'Turboman', 'turboalimentadores', ARRAY['Isuzu NKR', 'Isuzu NHR']::text[], null, null),
  ('JF-151', 'Turbo JMC motor Isuzu', 'Turboman', 'turboalimentadores', ARRAY['JMC Isuzu']::text[], null, null),
  ('JF-049', 'Turbo John Deere TA34/TB03', 'Turboman', 'turboalimentadores', ARRAY['John Deere']::text[], null, null),
  ('JF-031', 'Turbo Iveco Daily GT1752S', 'Turboman', 'turboalimentadores', ARRAY['Iveco Daily']::text[], null, null),
  ('JF-156', 'Turbo Kia Sorento 2.2', 'Turboman', 'turboalimentadores', ARRAY['Kia Sorento 2.2']::text[], null, null),
  ('KOMATSU-PC300', 'Turbo Komatsu PC300', 'Turboman', 'turboalimentadores', ARRAY['Komatsu PC300']::text[], null, null)
on conflict (referencia) do nothing;

notify pgrst, 'reload schema';
