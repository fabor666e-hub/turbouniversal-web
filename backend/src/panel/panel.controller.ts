import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GuardiaAdmin } from '../auth/guardia-admin';

type Fila = { valor: string; cantidad: number };

@UseGuards(GuardiaAdmin)
@Controller('panel')
export class PanelController {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  private async top(tipo: string, extra = ''): Promise<Fila[]> {
    const filas: { valor: string; cantidad: string }[] = await this.db.query(
      `SELECT detalle AS valor, COUNT(*) AS cantidad FROM eventos
       WHERE tipo = $1 AND detalle <> '' ${extra}
       GROUP BY detalle ORDER BY COUNT(*) DESC, detalle LIMIT 8`,
      [tipo],
    );
    return filas.map((f) => ({ valor: f.valor, cantidad: Number(f.cantidad) }));
  }

  @Get('resumen')
  async resumen() {
    const conteo: { tipo: string; cantidad: string }[] = await this.db.query(
      `SELECT tipo, COUNT(*) AS cantidad FROM eventos GROUP BY tipo`,
    );
    const n = (t: string) => Number(conteo.find((c) => c.tipo === t)?.cantidad ?? 0);
    const [{ cantidad: cotizaciones }] = await this.db.query(`SELECT COUNT(*) AS cantidad FROM cotizaciones`);

    return {
      totales: {
        vistas: n('vista_producto'),
        busquedas: n('busqueda'),
        agregados: n('agregar_cotizacion'),
        cotizaciones: Number(cotizaciones),
      },
      masVistos: await this.top('vista_producto'),
      masAgregados: await this.top('agregar_cotizacion'),
      masBuscados: await this.top('busqueda'),
      categorias: await this.top('categoria'),
      clics: await this.top('clic'),
      vehiculosAsistente: await this.top('asistente', `AND detalle LIKE 'modelo:%'`),
      stockBajo: await this.db.query(
        `SELECT referencia, nombre, stock FROM productos WHERE stock <= 3 ORDER BY stock, referencia`,
      ),
    };
  }
}
