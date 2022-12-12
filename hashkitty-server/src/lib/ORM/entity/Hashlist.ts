/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hashlist {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    name!: string;

    @Column('varchar', { nullable: true })
    description?: string;

    @Column('varchar')
    path!: string;

    @Column('date', { default: new Date(), name: 'created_at' })
    createdAt!: Date;

    @Column('date', { default: new Date(), name: 'lastest_modification' })
    lastestModification!: Date;

    @Column('int', { nullable: true, name: 'number_of_cracked_passwords' })
    numberOfCrackedPasswords?: number;
}
