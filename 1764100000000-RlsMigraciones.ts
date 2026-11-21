import { MigrationInterface, QueryRunner } from 'typeorm';

// Auditoría (docs/calidad/interventoria.md, hallazgo A-01): en Supabase la tabla
// "migrations" que crea TypeORM quedaba expuesta a la clave pública sin RLS.
// Se activa RLS sin políticas y se quitan los permisos de anon/authenticated.
// En un PostgreSQL normal (CI, local) esos roles no existen y solo se activa RLS.
export class RlsMigraciones1764100000000 implements MigrationInterface {
  name = 'RlsMigraciones1764100000000';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE IF EXISTS migrations ENABLE ROW LEVEL SECURITY`);
    await q.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
          REVOKE ALL ON TABLE migrations FROM anon;
        END IF;
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
          REVOKE ALL ON TABLE migrations FROM authenticated;
        END IF;
      END $$`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE IF EXISTS migrations DISABLE ROW LEVEL SECURITY`);
  }
}
