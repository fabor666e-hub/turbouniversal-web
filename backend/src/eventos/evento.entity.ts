import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export const TIPOS_EVENTO = [
  'vista_producto',
  'busqueda',
  'categoria',
  'clic',
  'agregar_cotizacion',
  'asistente',
  'video',
] as const;

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 30 })
  tipo: string;

  @Column({ type: 'varchar', length: 120, default: '' })
  detalle: string;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamptz' })
  creadoEn: Date;
}
