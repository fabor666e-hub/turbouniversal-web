import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Throttle } from '@nestjs/throttler';
import { Repository } from 'typeorm';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { Evento } from './evento.entity';

@Controller('eventos')
export class EventosController {
  constructor(@InjectRepository(Evento) private readonly eventos: Repository<Evento>) {}

  // Máximo 60 eventos por minuto por IP (B3)
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Post()
  @HttpCode(202)
  async registrar(@Body() dto: CrearEventoDto) {
    await this.eventos.insert({ tipo: dto.tipo, detalle: dto.detalle ?? '' });
    return { ok: true };
  }
}
