/* eslint-disable @typescript-eslint/no-unused-vars */
import { Options } from './Options';
import { HashType } from './HashType';
import { TemplateTask } from './TemplateTask';
import {
    PrimaryGeneratedColumn,
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar', { nullable: false })
    name!: string;

    @Column('varchar', { nullable: true })
    description!: string;

    @OneToOne(() => Options, { nullable: false })
    @JoinColumn({ name: 'options_id', referencedColumnName: 'id' })
    options!: Options;

    @ManyToOne(
        () => TemplateTask,
        (templateTask: TemplateTask) => templateTask.id
    )
    @JoinColumn({ name: 'template_task_id', referencedColumnName: 'id' })
    templateTaskId!: TemplateTask | null;

    @ManyToOne(() => HashType, (hashType: HashType) => hashType.id)
    @JoinColumn({ name: 'hashtype_id', referencedColumnName: 'id' })
    hashTypeId!: number;

    @Column('date', { default: new Date(), name: 'created_at' })
    createdAt!: Date;

    @Column('date', { default: new Date(), name: 'lastest_modification' })
    lastestModification!: Date;

    @Column('date', { nullable: true, name: 'ended_at' })
    endeddAt!: Date;

    @Column('bool', { nullable: true, name: 'is_finished' })
    isfinished!: Boolean;
}
