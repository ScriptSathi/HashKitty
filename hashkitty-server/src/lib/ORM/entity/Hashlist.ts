/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { HashType } from './HashType';

@Entity()
export class Hashlist {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    name!: string;

    @Column('varchar', { default: '' })
    description?: string;

    @ManyToOne(() => HashType, (hashType: HashType) => hashType.id)
    @JoinColumn({ name: 'hashtype_id', referencedColumnName: 'id' })
    hashTypeId!: number;

    @Column('date', { default: new Date(), name: 'created_at' })
    createdAt!: Date;

    @Column('date', { default: new Date(), name: 'lastest_modification' })
    lastestModification!: Date;

    @Column('int', { default: -1, name: 'number_of_cracked_passwords' })
    numberOfCrackedPasswords?: number;

    @Column('varchar', { default: '', name: 'cracked_output_file_name' })
    crackedOutputFileName?: string;
}
