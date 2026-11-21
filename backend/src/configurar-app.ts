import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationError } from 'class-validator';
import { FiltroErrores } from './comun/filtro-errores';
import { ErrorApi } from './comun/errores';
import { config } from './config';

const mensajes = (errores: ValidationError[], prefijo = ''): { campos: string[]; textos: string[] } => {
  const campos: string[] = [];
  const textos: string[] = [];
  for (const e of errores) {
    const campo = prefijo ? `${prefijo}.${e.property}` : e.property;
    if (e.constraints) {
      campos.push(campo);
      textos.push(...Object.values(e.constraints));
    }
    if (e.children?.length) {
      const hijos = mensajes(e.children, campo);
      campos.push(...hijos.campos);
      textos.push(...hijos.textos);
    }
  }
  return { campos, textos };
};

// Configuración compartida por main.ts y las pruebas
export function configurarApp(app: INestApplication) {
  const { origenesFront } = config();
  app.setGlobalPrefix('api');
  (app as NestExpressApplication).set('trust proxy', 1); // Render pasa la IP real del visitante
  app.enableCors({ origin: origenesFront, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta campos que no están en el contrato (por ejemplo, un "precio" enviado en la cotización)
      transform: true,
      exceptionFactory: (errores) => {
        const { campos, textos } = mensajes(errores);
        return new ErrorApi(400, 'VALIDACION', textos[0] ?? 'Datos inválidos.', campos);
      },
    }),
  );
  app.useGlobalFilters(new FiltroErrores());
  return app;
}

