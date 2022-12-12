/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AttackMode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar', { nullable: false })
    name!: string;

    @Column('tinyint', { nullable: false })
    mode!: number;
}
