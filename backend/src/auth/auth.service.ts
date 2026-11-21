import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, timingSafeEqual } from 'crypto';
import { config } from '../config';
import { ErrorApi } from '../comun/errores';

const VIGENCIA_HORAS = 8;
const resumen = (t: string) => createHash('sha256').update(t).digest();

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  // Compara en tiempo constante para no dar pistas sobre la clave
  async login(clave: string) {
    if (!timingSafeEqual(resumen(clave), resumen(config().claveAdmin)))
      throw new ErrorApi(HttpStatus.UNAUTHORIZED, 'NO_AUTORIZADO', 'Clave incorrecta.');
    const token = await this.jwt.signAsync({ rol: 'admin' }, { expiresIn: `${VIGENCIA_HORAS}h` });
    const expiraEn = new Date(Date.now() + VIGENCIA_HORAS * 3600_000).toISOString();
    return { token, expiraEn };
  }
}
