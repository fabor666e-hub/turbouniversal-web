import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ErrorApi, noEncontrado } from '../comun/errores';
import { normalizar } from '../comun/texto';
import { CATEGORIAS } from './categorias';
import { ActualizarProductoDto, CrearProductoDto, FiltroProductosDto } from './dto/producto.dto';
import { Producto } from './producto.entity';

@Injectable()
export class ProductosService {
  constructor(@InjectRepository(Producto) private readonly repo: Repository<Producto>) {}

  // El catálogo es pequeño: se filtra en memoria con la misma lógica del front (sin tildes ni mayúsculas)
  async listar(filtro: FiltroProductosDto = {}): Promise<Producto[]> {
    const todos = await this.repo.find({ order: { referencia: 'ASC' } });
    const q = normalizar(filtro.q ?? '');
    return todos.filter(
      (p) =>
        (!filtro.categoria || p.categoria === filtro.categoria) &&
        (!filtro.marca || normalizar(p.marca) === normalizar(filtro.marca)) &&
        (!q || normalizar([p.referencia, p.nombre, p.marca, ...p.vehiculos].join(' ')).includes(q)),
    );
  }

  async obtener(referencia: string): Promise<Producto> {
    const p = await this.repo.findOneBy({ referencia: referencia.toUpperCase() });
    if (!p) throw noEncontrado(`No existe el producto ${referencia}.`);
    return p;
  }

  async categorias() {
    const todos = await this.repo.find({ select: { categoria: true, referencia: true } });
    return CATEGORIAS.map((c) => ({ ...c, cantidad: todos.filter((p) => p.categoria === c.slug).length }));
  }

  // "Chevrolet NPR" -> { marca: "Chevrolet", modelos: ["NPR"] }
  async vehiculos() {
    const todos = await this.repo.find({ select: { vehiculos: true, referencia: true } });
    const mapa = new Map<string, Set<string>>();
    for (const p of todos)
      for (const v of p.vehiculos) {
        const [marca, ...resto] = v.trim().split(/\s+/);
        if (!mapa.has(marca)) mapa.set(marca, new Set());
        mapa.get(marca)!.add(resto.join(' ') || 'Todos los modelos');
      }
    return [...mapa.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'es'))
      .map(([marca, modelos]) => ({ marca, modelos: [...modelos].sort((a, b) => a.localeCompare(b, 'es')) }));
  }

  async crear(dto: CrearProductoDto): Promise<Producto> {
    try {
      await this.repo.insert({ ...dto, imagen: dto.imagen ?? null });
    } catch (e) {
      if (e instanceof QueryFailedError && (e as { driverError?: { code?: string } }).driverError?.code === '23505')
        throw new ErrorApi(
          HttpStatus.CONFLICT,
          'REFERENCIA_DUPLICADA',
          `Ya existe un producto con la referencia ${dto.referencia}.`,
        );
      throw e;
    }
    return this.obtener(dto.referencia);
  }

  async actualizar(referencia: string, dto: ActualizarProductoDto): Promise<Producto> {
    const actual = await this.obtener(referencia);
    await this.repo.update({ referencia: actual.referencia }, { ...dto, imagen: dto.imagen ?? null });
    return this.obtener(actual.referencia);
  }

  async cambiarStock(referencia: string, delta: number): Promise<Producto> {
    const actual = await this.obtener(referencia);
    await this.repo.update({ referencia: actual.referencia }, { stock: Math.max(0, actual.stock + delta) });
    return this.obtener(actual.referencia);
  }

  async borrar(referencia: string): Promise<void> {
    const actual = await this.obtener(referencia);
    await this.repo.delete({ referencia: actual.referencia });
  }
}
