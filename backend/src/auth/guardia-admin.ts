import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ErrorApi } from '../comun/errores';

// Protege las rutas 🔒: exige "Authorization: Bearer <token>" válido y vigente
@Injectable()
export class GuardiaAdmin implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const req = contexto.switchToHttp().getRequest<Request>();
    const [tipo, token] = (req.headers.authorization ?? '').split(' ');
    if (tipo !== 'Bearer' || !token)
      throw new ErrorApi(HttpStatus.UNAUTHORIZED, 'NO_AUTORIZADO', 'Inicia sesión en el panel.');
    try {
      const datos = await this.jwt.verifyAsync<{ rol?: string }>(token);
      if (datos.rol !== 'admin') throw new Error('rol');
      return true;
    } catch {
      throw new ErrorApi(HttpStatus.UNAUTHORIZED, 'NO_AUTORIZADO', 'La sesión venció o no es válida.');
    }
  }
}
