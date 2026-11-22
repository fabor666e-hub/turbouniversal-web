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

  // null = precio a consultar con un asesor
  @Column({ type: 'integer', nullable: true })
  precio: number | null;

  // null = disponibilidad a consultar (no se conoce el inventario)
  @Column({ type: 'integer', nullable: true })
  stock: number | null;

  @Column({ type: 'text', nullable: true })
  imagen: string | null;

  // Números de parte originales o equivalentes (el mecánico busca por ellos)
  @Column({ type: 'text', array: true, default: () => "'{}'" })
  oem: string[];

  @Column({ type: 'text', nullable: true })
  garantia: string | null;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamptz', select: false })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamptz', select: false })
  actualizadoEn: Date;
}
