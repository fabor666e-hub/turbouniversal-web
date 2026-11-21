import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { TIPOS_EVENTO } from '../evento.entity';

export class CrearEventoDto {
  @IsIn(TIPOS_EVENTO, { message: `El tipo debe ser uno de: ${TIPOS_EVENTO.join(', ')}.` })
  tipo: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(120, { message: 'El detalle debe tener máximo 120 caracteres.' })
  detalle?: string;
}
