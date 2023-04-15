/* eslint-disable @typescript-eslint/no-unused-vars */
import {
   PrimaryGeneratedColumn,
   Entity,
   JoinColumn,
   Column,
   ManyToOne,
} from 'typeorm';
import { AttackMode } from './AttackMode';
import { Wordlist } from './Wordlist';
import { WorkloadProfile } from './WorkloadProfile';

@Entity()
export class Options {
   @PrimaryGeneratedColumn()
   id!: number;

   @ManyToOne(() => AttackMode, (attackMode: AttackMode) => attackMode.id)
   @JoinColumn({ name: 'attack_mode_id', referencedColumnName: 'id' })
   attackModeId!: number;

   @Column('int', { default: 90, name: 'breakpoint_gpu_temperature' })
   breakpointGPUTemperature!: number;

   @ManyToOne(() => Wordlist, (wordlist: Wordlist) => wordlist.id)
   @JoinColumn({ name: 'combinator_wordlist_id', referencedColumnName: 'id' })
   combinatorWordlistId!: number;

   @ManyToOne(
      () => WorkloadProfile,
      (workloadProfile: WorkloadProfile) => workloadProfile.id
   )
   @JoinColumn({ name: 'workload_profile_id', referencedColumnName: 'id' })
   workloadProfileId!: number;

   @Column('bool', { default: false, name: 'kernel_opti' })
   kernelOpti!: boolean;

   @Column('bool', { default: false, name: 'cpu_only' })
   CPUOnly!: boolean;

   @ManyToOne(() => Wordlist, (wordlist: Wordlist) => wordlist.id)
   @JoinColumn({ name: 'wordlist_id', referencedColumnName: 'id' })
   wordlistId?: number;

   @Column('varchar', { name: 'rule_name', default: '' })
   rules?: string;

   @Column('varchar', { name: 'potfile_name', default: '' })
   potfileName?: string;

   @Column('varchar', { default: '', name: 'mask_query' })
   maskQuery?: string;

   @Column('varchar', { name: 'custom_charset_1' })
   customCharset1?: string;

   @Column('varchar', { name: 'custom_charset_2' })
   customCharset2?: string;

   @Column('varchar', { name: 'custom_charset_3' })
   customCharset3?: string;

   @Column('varchar', { name: 'custom_charset_4' })
   customCharset4?: string;

   @Column('varchar', { name: 'mask_filename' })
   maskFilename?: string;
}
