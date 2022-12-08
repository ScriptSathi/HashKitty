// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AttackMode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    name!: string;

    @Column('varchar')
    type!: string;
}
