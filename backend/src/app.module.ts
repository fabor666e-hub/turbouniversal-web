import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { Inicial1764000000000 } from './base-de-datos/migraciones/1764000000000-Inicial';
import { sembrar } from './base-de-datos/semilla';
import { config } from './config';
import { Cotizacion } from './cotizaciones/cotizacion.entity';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { Evento } from './eventos/evento.entity';
import { EventosModule } from './eventos/eventos.module';
import { PanelModule } from './panel/panel.module';
import { Producto } from './productos/producto.entity';
import { ProductosModule } from './productos/productos.module';
import { SaludController } from './salud/salud.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const { baseDeDatos } = config();
        return {
          type: 'postgres',
          url: baseDeDatos.url,
          ssl: baseDeDatos.ssl ? { rejectUnauthorized: false } : false,
          entities: [Producto, Evento, Cotizacion],
          migrations: [Inicial1764000000000],
          migrationsRun: true, // crea las tablas al arrancar
          synchronize: false, // nunca cambia la base sin una migración
        };
      },
    }),
    // Límite general: 300 peticiones por minuto por IP (eventos y login tienen el suyo)
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 300 }]),
    AuthModule,
    ProductosModule,
    CotizacionesModule,
    EventosModule,
    PanelModule,
  ],
  controllers: [SaludController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async onApplicationBootstrap() {
    await sembrar(this.db); // carga los 12 productos de ejemplo si la tabla está vacía
  }
}
