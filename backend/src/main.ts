import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config';
import { configurarApp } from './configurar-app';

async function arrancar() {
  const app = configurarApp(await NestFactory.create(AppModule));
  const { puerto } = config();
  await app.listen(puerto, '0.0.0.0');
  new Logger('API').log(`API de Turbo Universal en http://localhost:${puerto}/api`);
}

arrancar();
