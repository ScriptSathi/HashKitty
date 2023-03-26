import path = require('node:path');

import { Constants } from '../Constants';
import { TTask } from '../types/TApi';
import { CmdData, PartialCmdData } from '../types/THashcat';
import { hashcatParam } from './hashcatParams';

export class HashcatGenerator {
   public outputFilePath: string;
   private task: TTask;
   private taskName: string;
   private restorePath: string;
   private wordlist: string;
   private hashlist: string;

   constructor(task: TTask) {
      this.task = task;
      this.taskName = `${task.name}-${task.id}`;
      this.restorePath = path.join(Constants.restorePath, this.taskName);
      this.wordlist = path.join(
         Constants.wordlistPath,
         // Return empty string because Hashcat can use a directory as wordlist
         this.task.options.wordlistId.name.startsWith('*')
            ? ''
            : this.task.options.wordlistId.name
      );
      this.hashlist = path.join(
         Constants.hashlistsPath,
         this.task.hashlistId.name
      );
      this.outputFilePath = path.join(
         Constants.outputFilePath,
         `${this.task.hashlistId.name}-${this.task.hashlistId.id}`
      );
   }

   public generateStartCmd(): string {
      switch (this.task.options.attackModeId.mode) {
         case 0:
            return this.generateStraightAttackCmd();
         case 1:
            return this.generateCombinationAttackCmd();
         case 3:
            return this.generateBruteForceAttackCmd();
         case 6:
            return this.generateHybridWordlistAttackCmd();
         case 7:
            return this.generateHybridMaskAttackCmd();
         case 9:
            return this.generateAssociationAttackCmd();
         default:
            throw new Error(
               `No implementation of the attack mode ${this.task.options.attackModeId.mode}`
            );
      }
   }

   public generateRestoreCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareRestoreFlags()) +
         `${this.hashlist} ${this.wordlist}`
      );
   }

   private get mandatoryStartFlags(): PartialCmdData[] {
      return [
         {
            key: 'outputFile',
            value: this.outputFilePath,
         },
         {
            key: 'attackMode',
            value: this.task.options.attackModeId.mode,
         },
         {
            key: 'hashType',
            value: this.task.hashlistId.hashTypeId.typeNumber,
         },
         {
            key: 'potfilePath',
            value: path.join(
               Constants.potfilesPath,
               `${this.task.hashlistId.hashTypeId.typeNumber}`
            ),
         },
         ...this.defaultFlags,
      ];
   }

   private get defaultFlags(): PartialCmdData[] {
      return [
         {
            key: 'statusTimer',
            value: 1,
         },
         {
            key: 'status',
         },
         {
            key: 'statusJson',
         },
         {
            key: 'quiet',
         },
         {
            key: 'restoreFilePath',
            value: this.restorePath,
         },
         {
            key: 'session',
            value: this.taskName,
         },
      ];
   }

   private prepareStartFlags(): CmdData[] {
      const flags = this.mandatoryStartFlags;
      if (this.task.options.CPUOnly) {
         flags.push({
            key: 'cpuOnly',
         });
      }
      if (this.task.options.rules) {
         flags.push({
            key: 'rulesFile',
            value: this.task.options.rules.split(','),
         });
      }
      if (this.task.options.workloadProfileId) {
         flags.push({
            key: 'workloadProfile',
            value: this.task.options.workloadProfileId.profileId,
         });
      }
      return this.buildFlags(flags);
   }

   private prepareRestoreFlags(): CmdData[] {
      const flags = this.defaultFlags;
      return this.buildFlags(flags);
   }

   private generateCmdFromFlags(flags: CmdData[]): string {
      function buildSingleFlag(cmdData: CmdData, value?: string) {
         let cmd = `--${cmdData.flagData.flag}`;
         if (cmdData.flagData.needAParam) {
            if (cmdData.flagData.defaultValue && cmdData.value === undefined) {
               cmd += `=${cmdData.flagData.defaultValue}`;
            } else if (cmdData.value !== undefined) {
               cmd += `=${value || cmdData.value}`;
            } else {
               throw new Error(`Parameter needed for ${cmdData.flagData.flag}`);
            }
         }
         return (cmd += ' ');
      }
      return flags.reduce((acc: string, cmdData) => {
         let cmd = '';
         if (cmdData.flagData.isRepeatableFlag) {
            for (const value in cmdData.value as string[]) {
               cmd = buildSingleFlag(cmdData, value);
            }
         } else {
            cmd = buildSingleFlag(cmdData);
         }
         return acc + cmd;
      }, '');
   }

   private buildFlags(flags: PartialCmdData[]): CmdData[] {
      return flags.reduce(
         (acc: CmdData[], elem) => [
            ...acc,
            {
               ...elem,
               flagData: hashcatParam[elem.key],
            },
         ],
         []
      );
   }

   private generateStraightAttackCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareStartFlags()) +
         `${this.hashlist} ${this.wordlist}`
      );
   }

   private generateCombinationAttackCmd(): string {
      throw new Error('Combination attacks are not implemented yet');
   }

   private generateBruteForceAttackCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareStartFlags()) +
         `${this.hashlist} ${this.task.options.maskQuery}`
      );
   }

   private generateHybridWordlistAttackCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareStartFlags()) +
         `${this.hashlist} ${this.wordlist} ${this.task.options.maskQuery}`
      );
   }

   private generateHybridMaskAttackCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareStartFlags()) +
         `${this.hashlist} ${this.task.options.maskQuery} ${this.wordlist}`
      );
   }

   private generateAssociationAttackCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareStartFlags()) +
         `${this.hashlist} ${this.wordlist}`
      );
   }
}
