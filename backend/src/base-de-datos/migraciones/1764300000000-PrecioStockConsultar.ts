import { MigrationInterface, QueryRunner } from 'typeorm';

// Precio y stock pueden quedar "a consultar" (null): el catálogo de la empresa no publica
// precios ni inventario. Solo quita la restricción NOT NULL; no cambia datos.
export class PrecioStockConsultar1764300000000 implements MigrationInterface {
  name = 'PrecioStockConsultar1764300000000';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE productos ALTER COLUMN precio DROP NOT NULL`);
    await q.query(`ALTER TABLE productos ALTER COLUMN stock DROP NOT NULL`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`UPDATE productos SET precio = 0 WHERE precio IS NULL`);
    await q.query(`UPDATE productos SET stock = 0 WHERE stock IS NULL`);
    await q.query(`ALTER TABLE productos ALTER COLUMN precio SET NOT NULL`);
    await q.query(`ALTER TABLE productos ALTER COLUMN stock SET NOT NULL`);
  }
}
