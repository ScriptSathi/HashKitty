/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { NotificationType } from '../../types/TDAOs';

@Entity()
export class Notification {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column('timestamp', { default: new Date(), name: 'created_at' })
   createdAt!: Date;

   @Column('varchar', { nullable: false })
   status!: NotificationType;

   @Column('varchar', { nullable: false })
   message!: string;
}
