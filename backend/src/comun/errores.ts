import { HttpException, HttpStatus } from '@nestjs/common';

export type CodigoError =
  | 'VALIDACION'
  | 'NO_AUTORIZADO'
  | 'NO_ENCONTRADO'
  | 'REFERENCIA_DUPLICADA'
  | 'STOCK_INSUFICIENTE'
  | 'DEMASIADAS_SOLICITUDES'
  | 'ERROR_INTERNO';

// Error con el formato del contrato: { error: { codigo, mensaje, detalles? } }
export class ErrorApi extends HttpException {
  constructor(estado: HttpStatus, codigo: CodigoError, mensaje: string, detalles?: string[]) {
    super({ error: { codigo, mensaje, ...(detalles ? { detalles } : {}) } }, estado);
  }
}

export const noEncontrado = (mensaje: string) => new ErrorApi(HttpStatus.NOT_FOUND, 'NO_ENCONTRADO', mensaje);
