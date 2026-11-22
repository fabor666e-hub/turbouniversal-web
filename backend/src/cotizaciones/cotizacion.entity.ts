import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ItemCotizacion = {
  referencia: string;
  nombre: string;
  cantidad: number;
  precio: number | null; // null = precio a consultar
  subtotal: number | null; // null si el precio está a consultar
};

@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80 })
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'jsonb' })
  items: ItemCotizacion[];

  @Column({ type: 'integer' })
  total: number;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamptz' })
  creadoEn: Date;
}
