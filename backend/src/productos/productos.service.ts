import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ErrorApi, noEncontrado } from '../comun/errores';
import { normalizar, partirVehiculo } from '../comun/texto';
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
        (!q || normalizar([p.referencia, p.nombre, p.marca, ...p.vehiculos, ...(p.oem ?? [])].join(' ')).includes(q)),
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

  // "Chevrolet NPR" -> { marca: "Chevrolet", modelos: ["NPR"] } (respeta marcas compuestas como "Land Rover")
  async vehiculos() {
    const todos = await this.repo.find({ select: { vehiculos: true, referencia: true } });
    const mapa = new Map<string, Set<string>>();
    for (const p of todos)
      for (const v of p.vehiculos) {
        const { marca, modelo } = partirVehiculo(v);
        if (!mapa.has(marca)) mapa.set(marca, new Set());
        mapa.get(marca)!.add(modelo);
      }
    return [...mapa.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'es'))
      .map(([marca, modelos]) => ({ marca, modelos: [...modelos].sort((a, b) => a.localeCompare(b, 'es')) }));
  }

  async crear(dto: CrearProductoDto): Promise<Producto> {
    try {
      await this.repo.insert({
        ...dto,
        precio: dto.precio ?? null,
        stock: dto.stock ?? null,
        imagen: dto.imagen ?? null,
        oem: dto.oem ?? [],
        garantia: dto.garantia ?? null,
      });
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
    await this.repo.update(
      { referencia: actual.referencia },
      {
        ...dto,
        precio: dto.precio ?? null,
        stock: dto.stock ?? null,
        imagen: dto.imagen ?? null,
        oem: dto.oem ?? [],
        garantia: dto.garantia ?? null,
      },
    );
    return this.obtener(actual.referencia);
  }

  async cambiarStock(referencia: string, delta: number): Promise<Producto> {
    const actual = await this.obtener(referencia);
    await this.repo.update({ referencia: actual.referencia }, { stock: Math.max(0, (actual.stock ?? 0) + delta) });
    return this.obtener(actual.referencia);
  }

  async borrar(referencia: string): Promise<void> {
    const actual = await this.obtener(referencia);
    await this.repo.delete({ referencia: actual.referencia });
  }
}
