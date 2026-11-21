import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { GuardiaAdmin } from '../auth/guardia-admin';
import { CotizacionesService } from './cotizaciones.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizaciones: CotizacionesService) {}

  @Post()
  crear(@Body() dto: CrearCotizacionDto) {
    return this.cotizaciones.crear(dto);
  }

  @UseGuards(GuardiaAdmin)
  @Get()
  ultimas(@Query('limite', new DefaultValuePipe(20), ParseIntPipe) limite: number) {
    return this.cotizaciones.ultimas(limite);
  }
}
