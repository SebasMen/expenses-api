import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('float', { default: 0 })
  totalExpenses: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
