/* eslint-disable @typescript-eslint/no-unused-vars */
import { Options } from './Options';
import { TemplateTask } from './TemplateTask';
import { Hashlist } from './Hashlist';
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
    @PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    })
    id!: number;

    @Column('varchar')
    name!: string;

    @Column('varchar', { default: '' })
    description?: string;

    @OneToOne(() => Options)
    @JoinColumn({ name: 'options_id', referencedColumnName: 'id' })
    options!: Options;

    @ManyToOne(
        () => TemplateTask,
        (templateTask: TemplateTask) => templateTask.id
    )
    @JoinColumn({ name: 'template_task_id', referencedColumnName: 'id' })
    templateTaskId?: number;

    @ManyToOne(() => Hashlist, (hashlist: Hashlist) => hashlist.id)
    @JoinColumn({ name: 'hashlist_id', referencedColumnName: 'id' })
    hashlistId!: number;

    @Column('timestamp', { default: new Date(), name: 'created_at' })
    createdAt!: Date;

    @Column('timestamp', {
        default: new Date(),
        name: 'lastest_modification',
    })
    lastestModification!: Date;

    @Column('timestamp', { nullable: true, name: 'ended_at' })
    endeddAt?: Date;

    @Column('bool', { nullable: true, default: false, name: 'is_finished' })
    isfinished?: boolean;
}
