/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class HashType {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column('int', { name: 'type_number' })
   typeNumber!: number;

   @Column('varchar')
   name!: string;

   @Column('varchar', { default: '' })
   description?: string;
}
