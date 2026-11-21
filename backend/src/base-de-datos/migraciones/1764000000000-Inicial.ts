import { MigrationInterface, QueryRunner } from 'typeorm';

// Crea las tablas si no existen. Usa IF NOT EXISTS para funcionar también
// sobre una base que ya tenga estas tablas (por ejemplo, la de Supabase).
export class Inicial1764000000000 implements MigrationInterface {
  name = 'Inicial1764000000000';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE IF NOT EXISTS productos (
        referencia varchar(30) PRIMARY KEY,
        nombre varchar(120) NOT NULL,
        marca varchar(60) NOT NULL,
        categoria varchar(40) NOT NULL,
        vehiculos text[] NOT NULL DEFAULT '{}',
        precio integer NOT NULL CHECK (precio >= 0),
        stock integer NOT NULL CHECK (stock >= 0),
        imagen text
      )`);
    await q.query(`ALTER TABLE productos ADD COLUMN IF NOT EXISTS creado_en timestamptz NOT NULL DEFAULT now()`);
    await q.query(`ALTER TABLE productos ADD COLUMN IF NOT EXISTS actualizado_en timestamptz NOT NULL DEFAULT now()`);

    await q.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id serial PRIMARY KEY,
        tipo varchar(30) NOT NULL,
        detalle varchar(120) NOT NULL DEFAULT '',
        creado_en timestamptz NOT NULL DEFAULT now()
      )`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos (tipo)`);

    await q.query(`
      CREATE TABLE IF NOT EXISTS cotizaciones (
        id serial PRIMARY KEY,
        nombre varchar(80) NOT NULL,
        telefono varchar(20) NOT NULL,
        items jsonb NOT NULL,
        total integer NOT NULL,
        creado_en timestamptz NOT NULL DEFAULT now()
      )`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS cotizaciones`);
    await q.query(`DROP TABLE IF EXISTS eventos`);
    await q.query(`DROP TABLE IF EXISTS productos`);
  }
}
