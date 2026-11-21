import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SkipThrottle } from '@nestjs/throttler';
import { DataSource } from 'typeorm';

@SkipThrottle()
@Controller('salud')
export class SaludController {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  // Render usa esta ruta para saber si la API está viva
  @Get()
  async salud() {
    let baseDeDatos = 'ok';
    try {
      await this.db.query('SELECT 1');
    } catch {
      baseDeDatos = 'error';
    }
    return { estado: 'ok', baseDeDatos };
  }
}
