/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WorkloadProfile {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column('int', { nullable: false, name: 'profile_id' })
   profileId!: number;

   @Column('varchar', { nullable: false, name: 'power_consumation' })
   powerConsumation!: string;

   @Column('varchar', { nullable: false, name: 'desktop_impact' })
   desktopImpact!: string;
}
