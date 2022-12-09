/* eslint-disable @typescript-eslint/no-unused-vars */
import { Options } from './Options';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';

@Entity()
export class TemplateTask {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar', { nullable: false })
    name!: string;

    @Column('varchar', { nullable: true })
    description?: string;

    @OneToOne(() => Options)
    @JoinColumn({ name: 'options_id', referencedColumnName: 'id' })
    options!: Options;

    @Column('date', { default: new Date(), name: 'created_at' })
    createdAt!: Date;

    @Column('date', { default: new Date(), name: 'lastest_modification' })
    lastestModification!: Date;
}
