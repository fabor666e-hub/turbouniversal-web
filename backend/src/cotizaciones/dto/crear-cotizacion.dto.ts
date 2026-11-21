import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, Equals, IsArray, IsInt, IsString, Length, Matches, Max, Min, ValidateNested } from 'class-validator';

export class ItemSolicitadoDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString({ message: 'Cada ítem necesita una referencia.' })
  @Length(2, 30)
  referencia: string;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad mínima es 1.' })
  @Max(99, { message: 'La cantidad máxima es 99.' })
  cantidad: number;
}

export class CrearCotizacionDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El nombre es obligatorio.' })
  @Length(2, 80, { message: 'El nombre debe tener entre 2 y 80 caracteres.' })
  nombre: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/[\s()+-]/g, '') : value))
  @Matches(/^\d{7,15}$/, { message: 'El teléfono debe tener entre 7 y 15 dígitos.' })
  telefono: string;

  @Equals(true, { message: 'Debes aceptar el tratamiento de datos personales (Ley 1581).' })
  aceptaDatos: boolean;

  @IsArray({ message: 'Los ítems deben ser una lista.' })
  @ArrayMinSize(1, { message: 'Agrega al menos un producto.' })
  @ArrayMaxSize(30, { message: 'Máximo 30 productos por cotización.' })
  @ValidateNested({ each: true })
  @Type(() => ItemSolicitadoDto)
  items: ItemSolicitadoDto[];
}
