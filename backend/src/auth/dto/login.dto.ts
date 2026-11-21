import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'La clave es obligatoria.' })
  @MinLength(1, { message: 'La clave es obligatoria.' })
  @MaxLength(200)
  clave: string;
}
