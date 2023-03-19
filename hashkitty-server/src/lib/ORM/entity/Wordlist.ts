/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Wordlist {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column('varchar', { nullable: false })
   name!: string;

   @Column('varchar', { default: '' })
   description?: string;

   @Column('varchar', { nullable: false })
   path!: string;
}
