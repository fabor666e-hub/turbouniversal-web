import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  referencia: string;

  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Column({ type: 'varchar', length: 60 })
  marca: string;

  @Column({ type: 'varchar', length: 40 })
  categoria: string;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  vehiculos: string[];

  @Column({ type: 'integer' })
  precio: number;

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'text', nullable: true })
  imagen: string | null;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamptz', select: false })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamptz', select: false })
  actualizadoEn: Date;
}
