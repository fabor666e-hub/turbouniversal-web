import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Response } from 'express';

const CODIGOS: Record<number, string> = {
  400: 'VALIDACION',
  401: 'NO_AUTORIZADO',
  403: 'NO_AUTORIZADO',
  404: 'NO_ENCONTRADO',
  429: 'DEMASIADAS_SOLICITUDES',
};

// Convierte cualquier error al formato del contrato (docs/contratos/api.md)
@Catch()
export class FiltroErrores implements ExceptionFilter {
  private readonly log = new Logger('Errores');

  catch(excepcion: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (excepcion instanceof ThrottlerException) {
      return res.status(429).json({
        error: { codigo: 'DEMASIADAS_SOLICITUDES', mensaje: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
      });
    }

    if (excepcion instanceof HttpException) {
      const estado = excepcion.getStatus();
      const cuerpo = excepcion.getResponse() as { error?: unknown; message?: unknown };
      if (cuerpo && typeof cuerpo === 'object' && 'error' in cuerpo && typeof cuerpo.error === 'object') {
        return res.status(estado).json(cuerpo);
      }
      const mensaje =
        estado === 404 ? 'La ruta no existe.' : estado === 401 ? 'No autorizado.' : String(cuerpo?.message ?? excepcion.message);
      return res.status(estado).json({ error: { codigo: CODIGOS[estado] ?? 'ERROR_INTERNO', mensaje } });
    }

    this.log.error(excepcion);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { codigo: 'ERROR_INTERNO', mensaje: 'Ocurrió un error inesperado.' } });
  }
}
