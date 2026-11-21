import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GuardiaAdmin } from '../auth/guardia-admin';
import { ActualizarProductoDto, CambiarStockDto, CrearProductoDto, FiltroProductosDto } from './dto/producto.dto';
import { ProductosService } from './productos.service';

@Controller()
export class ProductosController {
  constructor(private readonly productos: ProductosService) {}

  // ----- Públicas (B1) -----
  @Get('productos')
  listar(@Query() filtro: FiltroProductosDto) {
    return this.productos.listar(filtro);
  }

  @Get('productos/:referencia')
  obtener(@Param('referencia') referencia: string) {
    return this.productos.obtener(referencia);
  }

  @Get('categorias')
  categorias() {
    return this.productos.categorias();
  }

  @Get('vehiculos')
  vehiculos() {
    return this.productos.vehiculos();
  }

  // ----- Administración (B4) -----
  @UseGuards(GuardiaAdmin)
  @Post('productos')
  crear(@Body() dto: CrearProductoDto) {
    return this.productos.crear(dto);
  }

  @UseGuards(GuardiaAdmin)
  @Put('productos/:referencia')
  actualizar(@Param('referencia') referencia: string, @Body() dto: ActualizarProductoDto) {
    return this.productos.actualizar(referencia, dto);
  }

  @UseGuards(GuardiaAdmin)
  @Patch('productos/:referencia/stock')
  cambiarStock(@Param('referencia') referencia: string, @Body() dto: CambiarStockDto) {
    return this.productos.cambiarStock(referencia, dto.delta);
  }

  @UseGuards(GuardiaAdmin)
  @Delete('productos/:referencia')
  @HttpCode(204)
  async borrar(@Param('referencia') referencia: string) {
    await this.productos.borrar(referencia);
  }
}
