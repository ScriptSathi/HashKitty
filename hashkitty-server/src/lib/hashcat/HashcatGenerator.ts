import path = require('node:path');

import { Constants } from '../Constants';
import { TTask } from '../types/TApi';
import { CmdData, PartialCmdData } from '../types/THashcat';
import { hashcatParam } from './hashcatParams';
import { FsUtils } from '../utils/FsUtils';

export class HashcatGenerator {
   public outputFilePath: string;
   private task: TTask;
   private taskName: string;
   private restorePath: string;
   private hashlist: string;
   private fsUtils: FsUtils;

   constructor(task: TTask, taskName: string) {
      this.task = task;
      this.taskName = taskName;
      this.fsUtils = new FsUtils();
      this.restorePath = path.join(Constants.restorePath, this.taskName);
      this.hashlist = path.join(
         Constants.hashlistsPath,
         this.task.hashlistId.name
      );
      this.outputFilePath = path.join(
         Constants.outputFilePath,
         `${this.task.hashlistId.name}-${this.task.hashlistId.id}`
      );
   }

   public async generateCmd(): Promise<string> {
      const restoreFileExists = await this.fsUtils.fileExist(
         this.taskName,
         'restore'
      );

      if (restoreFileExists) return this.generateRestoreCmd();

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
      const charsetIds = [1, 2, 3, 4];
      for (const id of charsetIds) {
         const key = `customCharset${id}` as `customCharset${1 | 2 | 3 | 4}`;
         if (this.task.options[key]) {
            flags.push({
               key,
               value: this.task.options[key],
            });
         }
      }
      return this.buildFlags(flags);
   }

   private prepareRestoreFlags(): CmdData[] {
      const flags = this.defaultFlags;
      const restoreFlag: PartialCmdData = { key: 'restore' };
      return this.buildFlags([...flags, restoreFlag]);
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
            for (const value of cmdData.value as string[]) {
               cmd += buildSingleFlag(cmdData, value);
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
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareStartFlags()) +
         `${this.hashlist} ${this.wordlist} ${this.combinatorWordlist}`
      );
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

   private generateRestoreCmd(): string {
      return (
         `${Constants.defaultBin} ` +
         this.generateCmdFromFlags(this.prepareRestoreFlags())
      );
   }

   private get wordlist(): string {
      return path.join(
         Constants.wordlistPath,
         // Return empty string because Hashcat can use a directory as wordlist
         this.task.options.wordlistId?.name.startsWith('*')
            ? ''
            : this.task.options.wordlistId?.name ?? ''
      );
   }

   private get combinatorWordlist(): string {
      return path.join(
         Constants.wordlistPath,
         // Return empty string because Hashcat can use a directory as wordlist
         this.task.options.combinatorWordlistId?.name.startsWith('*')
            ? ''
            : this.task.options.combinatorWordlistId?.name ?? ''
      );
   }
}
