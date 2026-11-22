import { MigrationInterface, QueryRunner } from 'typeorm';

// Números de parte OEM y garantía por producto (docs/contratos/api.md, modelo Producto).
// Solo agrega columnas: no borra ni cambia datos existentes.
export class OemGarantia1764200000000 implements MigrationInterface {
  name = 'OemGarantia1764200000000';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE productos ADD COLUMN IF NOT EXISTS oem text[] NOT NULL DEFAULT '{}'`);
    await q.query(`ALTER TABLE productos ADD COLUMN IF NOT EXISTS garantia text`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE productos DROP COLUMN IF EXISTS garantia`);
    await q.query(`ALTER TABLE productos DROP COLUMN IF EXISTS oem`);
  }
}
