import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { SLUGS_CATEGORIA } from '../categorias';

const limpiar = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

// Campos que se pueden editar (todo menos la referencia)
export class ActualizarProductoDto {
  @Transform(limpiar)
  @IsString({ message: 'El nombre es obligatorio.' })
  @Length(3, 120, { message: 'El nombre debe tener entre 3 y 120 caracteres.' })
  nombre: string;

  @Transform(limpiar)
  @IsString({ message: 'La marca es obligatoria.' })
  @Length(2, 60, { message: 'La marca debe tener entre 2 y 60 caracteres.' })
  marca: string;

  @IsIn(SLUGS_CATEGORIA, { message: 'La categoría no es válida.' })
  categoria: string;

  @IsArray({ message: 'Los vehículos deben ser una lista.' })
  @ArrayMaxSize(30, { message: 'Máximo 30 vehículos por producto.' })
  @Transform(({ value }) =>
    Array.isArray(value) ? [...new Set(value.map((v) => String(v).trim().replace(/\s+/g, ' ')).filter(Boolean))] : value,
  )
  @Matches(/^\S+\s+\S.*$/, { each: true, message: 'Cada vehículo debe tener el formato "Marca Modelo".' })
  @MaxLength(60, { each: true, message: 'Cada vehículo debe tener máximo 60 caracteres.' })
  vehiculos: string[];

  // null o sin enviar = "precio a consultar"
  @IsOptional()
  @IsInt({ message: 'El precio debe ser un número entero.' })
  @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
  @Max(1_000_000_000, { message: 'El precio es demasiado alto.' })
  precio?: number | null;

  // null o sin enviar = "disponibilidad a consultar"
  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero.' })
  @Min(0, { message: 'El stock debe ser mayor o igual a 0.' })
  @Max(100_000, { message: 'El stock es demasiado alto.' })
  stock?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imagen?: string | null;

  @IsOptional()
  @IsArray({ message: 'Los números OEM deben ser una lista.' })
  @ArrayMaxSize(20, { message: 'Máximo 20 números OEM por producto.' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? [...new Set(value.map((v) => String(v).trim().toUpperCase().replace(/\s+/g, ' ')).filter(Boolean))]
      : value,
  )
  @Matches(/^[A-Z0-9][A-Z0-9 .\/-]{1,39}$/, {
    each: true,
    message: 'Cada número OEM debe tener de 2 a 40 caracteres: letras, números, guiones, puntos, barras o espacios.',
  })
  oem?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() || null : value))
  @IsString({ message: 'La garantía debe ser un texto.' })
  @MaxLength(120, { message: 'La garantía debe tener máximo 120 caracteres.' })
  garantia?: string | null;
}

export class CrearProductoDto extends ActualizarProductoDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @Matches(/^[A-Z0-9][A-Z0-9-]{1,29}$/, {
    message: 'La referencia debe tener de 2 a 30 caracteres: letras, números y guiones.',
  })
  referencia: string;
}

export class CambiarStockDto {
  @IsIn([1, -1], { message: 'delta debe ser 1 o -1.' })
  delta: number;
}

export class FiltroProductosDto {
  @IsOptional() @IsString() @MaxLength(80) q?: string;
  @IsOptional() @IsString() @MaxLength(40) categoria?: string;
  @IsOptional() @IsString() @MaxLength(60) marca?: string;
}
