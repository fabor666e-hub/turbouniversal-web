import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErrorApi, noEncontrado } from '../comun/errores';
import { Producto } from '../productos/producto.entity';
import { Cotizacion, ItemCotizacion } from './cotizacion.entity';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion) private readonly cotizaciones: Repository<Cotizacion>,
    @InjectRepository(Producto) private readonly productos: Repository<Producto>,
  ) {}

  async crear(dto: CrearCotizacionDto): Promise<Cotizacion> {
    // Suma cantidades si la misma referencia viene repetida
    const pedidas = new Map<string, number>();
    for (const i of dto.items) pedidas.set(i.referencia, (pedidas.get(i.referencia) ?? 0) + i.cantidad);

    const encontrados = await this.productos.findBy({ referencia: In([...pedidas.keys()]) });
    const items: ItemCotizacion[] = [];
    for (const [referencia, cantidad] of pedidas) {
      const p = encontrados.find((x) => x.referencia === referencia);
      if (!p) throw noEncontrado(`No existe el producto ${referencia}.`);
      // Stock null = disponibilidad a consultar: no se limita aquí (la confirma el asesor)
      if (p.stock !== null && cantidad > p.stock)
        throw new ErrorApi(
          HttpStatus.CONFLICT,
          'STOCK_INSUFICIENTE',
          `Solo hay ${p.stock} unidad(es) de ${p.referencia}.`,
          [p.referencia],
        );
      // El precio SIEMPRE sale de la base de datos, nunca del navegador
      items.push({
        referencia,
        nombre: p.nombre,
        cantidad,
        precio: p.precio,
        subtotal: p.precio === null ? null : p.precio * cantidad,
      });
    }

    // Total de los productos con precio conocido; los "a consultar" los cotiza el asesor
    const total = items.reduce((s, i) => s + (i.subtotal ?? 0), 0);
    return this.cotizaciones.save(this.cotizaciones.create({ nombre: dto.nombre, telefono: dto.telefono, items, total }));
  }

  ultimas(limite = 20) {
    return this.cotizaciones.find({ order: { id: 'DESC' }, take: Math.min(Math.max(limite, 1), 100) });
  }
}
