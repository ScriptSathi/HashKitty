import { ApiOptionsFormData } from '../types/TDAOs';
import { TaskUpdate, TemplateUpdate, UploadFile } from '../types/TRoutes';
import { Options } from '../ORM/entity/Options';
import { Dao } from './DAOs/Dao';
import { Task } from '../ORM/entity/Task';
import { logger } from '../utils/Logger';
import { FsUtils } from '../utils/FsUtils';
import { Constants } from '../Constants';
import { Hashlist } from '../ORM/entity/Hashlist';
import { HashType } from '../ORM/entity/HashType';
import { UploadFileType } from '../types/TApi';
import { TemplateTask } from '../ORM/entity/TemplateTask';
import { AttackMode } from '../ORM/entity/AttackMode';

export class Sanitizer {
   public hasSucceded: boolean;
   public isAnUpdate: boolean;
   public errorMessage: string;
   public errorMessages: string[];
   private dao: Dao;
   private list: UploadFile;
   private options: Options;
   private task: Task;
   private template: TemplateTask;
   private hashlist: Hashlist;

   constructor(dao: Dao) {
      this.dao = dao;
      this.list = { fileName: '' };
      this.options = new Options();
      this.task = new Task();
      this.template = new TemplateTask();
      this.hashlist = new Hashlist();
      this.hasSucceded = true;
      this.isAnUpdate = false;
      this.errorMessage = '';
      this.errorMessages = [];
   }

   public async analyseTask(form: TaskUpdate): Promise<void> {
      this.setTaskIfIsUpdate(form.id);
      this.task.name = this.sanitizeText(form.name, 'name', 50);
      this.task.description = this.sanitizeText(
         form.description,
         'description',
         255,
         true
      );
      await Promise.all([
         this.checkHashlist(form.hashlistId),
         this.checkOptions(form.options),
      ]);
      this.task.options = this.options;
   }

   public async analyseTemplate(form: TemplateUpdate): Promise<void> {
      if (form.id) {
         if (await this.dao.templateExistById(form.id)) {
            this.template = await this.dao.template.getById(form.id);
            this.options = this.template.options;
            this.isAnUpdate = true;
         } else {
            this.setError('wrongData', 'template');
         }
      }
      this.template.name = this.sanitizeText(form.name, 'name', 50);
      this.template.description = this.sanitizeText(
         form.description,
         'description',
         255,
         true
      );
      await this.checkOptions(form.options);
      this.template.options = this.options;
   }

   public async analyseList({
      type,
      hashTypeId,
      fileName,
   }: UploadFile & {
      type: UploadFileType;
      hashTypeId?: number;
   }): Promise<void> {
      const name = this.sanitizeText(fileName, 'fileName');
      if (hashTypeId && type === 'hashlist') {
         this.hashlist.name = name;
         await this.checkHashType(hashTypeId);
      } else {
         this.list.fileName = name;
      }
   }

   public getTask(): Task {
      return this.task;
   }

   public getHashlist(): Hashlist {
      return this.hashlist;
   }

   public getTemplate(): TemplateTask {
      return this.template;
   }

   public getList(): UploadFile {
      return this.list;
   }

   public removeSpecialCharInString(input: string): string {
      return input.replace(/[^\w._-]/gi, '');
   }

   public shortenStringByLength(length: number, str: string): string {
      return str.length > length ? `${str.substring(0, length - 3)}...` : str;
   }

   private async checkOptions(options: ApiOptionsFormData) {
      try {
         const attackMode = await this.dao.attackMode.getById(
            options.attackModeId
         );
         if (!attackMode) this.setError('wrongData', 'attackMode');
         else {
            this.options.attackModeId = attackMode.id;
            await this.checkSpecificConfigForSpecificAttackMode(
               options,
               attackMode.mode
            );
            await this.checkAdvancedConfig(options);
         }
      } catch {
         this.setError('unexpected', 'attackMode');
      }
   }

   private async checkSpecificConfigForSpecificAttackMode(
      options: ApiOptionsFormData,
      attackMode: number
   ): Promise<void> {
      switch (attackMode) {
         case 0:
            if (options.wordlistName)
               await this.checkWordlist(options.wordlistName);
            else this.setError('mandatory', 'wordlistName');
            options.rules && this.checkRules(options.rules);
            break;
         case 1:
            if (options.wordlistName)
               await this.checkWordlist(options.wordlistName);
            else this.setError('mandatory', 'wordlistName');
            if (options.combinatorWordlistName)
               this.checkCombinatorWordlist(options.combinatorWordlistName);
            else this.setError('mandatory', 'combinatorWordlistName');
            break;
         case 3:
            if (options.maskQuery) this.checkMaskQuery(options.maskQuery);
            else this.setError('mandatory', 'maskQuery');
            options.customCharset1 &&
               this.checkCustomCharset(options.customCharset1, 1);
            options.customCharset2 &&
               this.checkCustomCharset(options.customCharset2, 2);
            options.customCharset3 &&
               this.checkCustomCharset(options.customCharset3, 3);
            options.customCharset4 &&
               this.checkCustomCharset(options.customCharset4, 4);
            break;
         case 6:
            if (options.wordlistName)
               await this.checkWordlist(options.wordlistName);
            else this.setError('mandatory', 'wordlistName');
            if (options.maskQuery) this.checkMaskQuery(options.maskQuery);
            else this.setError('mandatory', 'maskQuery');
            break;
         case 7:
            if (options.wordlistName)
               await this.checkWordlist(options.wordlistName);
            else this.setError('mandatory', 'wordlistName');
            if (options.maskQuery) this.checkMaskQuery(options.maskQuery);
            else this.setError('mandatory', 'maskQuery');
            break;
         case 9:
            if (options.wordlistName)
               await this.checkWordlist(options.wordlistName);
            else this.setError('mandatory', 'wordlistName');
            break;
         default:
            throw new Error(`The attack mode ${attackMode} is not defined`);
      }
   }

   private async checkAdvancedConfig(
      options: ApiOptionsFormData
   ): Promise<void> {
      this.breakpointGPUTemperature(options.breakpointGPUTemperature);
      this.checkKernelOptions(options.kernelOpti);
      this.checkCPUOnly(options.CPUOnly);
      this.checkPotfiles(options.potfileName || '');
   }

   private async checkWordlist(name: string): Promise<void> {
      try {
         const wordlist = await this.dao.findWordlistWhere({ name });
         if (wordlist !== null) {
            this.options.wordlistId = wordlist.id;
         } else {
            this.setError('wrongData', 'wordlist');
         }
      } catch (error) {
         this.setError('unexpected', 'wordlist');
      }
   }

   private checkCustomCharset(query: string, charset: 1 | 2 | 3 | 4) {
      const validQueries = query.match(/^[\w?]*$/gi);
      const queryIsSet = query.length > 0;
      if (!!validQueries && queryIsSet) {
         this.options[`customCharset${charset}`] = query;
      } else if (queryIsSet) {
         this.setError('wrongData', `customCharset${charset}`);
      }
   }

   private async checkCombinatorWordlist(name: string): Promise<void> {
      try {
         const wordlist = await this.dao.findWordlistWhere({ name });
         if (wordlist !== null) {
            this.options.combinatorWordlistId = wordlist.id;
         } else {
            this.setError('wrongData', 'combinatorWordlistId');
         }
      } catch (error) {
         this.setError('unexpected', 'combinatorWordlistId');
      }
   }

   private async checkHashlist(id: number): Promise<void> {
      try {
         if (await this.dao.findHashlistExistWhere({ id })) {
            const hashlist = await this.dao.hashlist.getById(id);
            if (hashlist !== null) {
               this.task.hashlistId = hashlist.id;
            } else {
               this.setError('wrongData', 'hashlist');
            }
         } else {
            this.setError('wrongData', 'hashlist');
         }
      } catch (error) {
         this.setError('unexpected', 'hashlist');
      }
   }

   private async checkHashType(id: number): Promise<void> {
      try {
         if (await this.dao.findHashTypeExistById(id)) {
            const hashtype = await this.dao.db
               .getRepository(HashType)
               .findOne({ where: { id } });
            if (hashtype !== null) {
               this.hashlist.hashTypeId = hashtype.id;
            } else {
               this.setError('wrongData', 'hashtype');
            }
         } else {
            this.setError('wrongData', 'hashtype');
         }
      } catch (error) {
         this.setError('unexpected', 'hashtype');
      }
   }

   private async checkWorkloadProfile(profileId: number): Promise<void> {
      try {
         const workloadProfile = await this.dao.findWorkloadProfileByName(
            profileId
         );
         if (workloadProfile !== null) {
            this.options.workloadProfileId = workloadProfile.id;
         } else {
            this.setError('wrongData', 'workload profile');
         }
      } catch (error) {
         this.setError('unexpected', 'workload profile');
      }
   }

   private breakpointGPUTemperature(temperature: number): void {
      try {
         if (this.isExpectedType(temperature, 'number')) {
            if (temperature < 0 || temperature > 100) {
               this.options.breakpointGPUTemperature = 90;
            } else if (0 < temperature && temperature < 100) {
               this.options.breakpointGPUTemperature = temperature;
            } else {
               this.setError('wrongData', 'breakpointGPUTemperature');
            }
         } else {
            this.setError('wrongData', 'breakpointGPUTemperature');
         }
      } catch (error) {
         this.setError('unexpected', 'breakpointGPUTemperature');
      }
   }

   private checkMaskQuery(mask: string): void {
      try {
         if (this.isExpectedType(mask, 'string')) {
            if (mask.match(/^[\w?]*$/gi)) {
               this.options.maskQuery = mask;
            } else {
               this.setError('wrongData', 'maskQuery');
            }
         } else {
            this.setError('wrongData', 'maskQuery');
         }
      } catch (error) {
         this.setError('unexpected', 'maskQuery');
      }
   }

   private async checkAttackMode(id: number): Promise<void> {
      try {
         const attackMode = await this.dao.findAttackModeById(id);
         if (attackMode !== null) {
            this.options.attackModeId = attackMode.id;
         } else {
            this.setError('wrongData', 'attack mode');
         }
      } catch (error) {
         this.setError('unexpected', 'attack mode');
      }
   }

   private checkKernelOptions(value: boolean): void {
      try {
         if (this.isExpectedType(value, 'boolean')) {
            this.options.kernelOpti = value;
         } else {
            this.setError('wrongData', 'kernelOpti');
         }
      } catch (error) {
         this.setError('unexpected', 'kernelOpti');
      }
   }

   private checkCPUOnly(value: boolean): void {
      try {
         if (this.isExpectedType(value, 'boolean')) {
            this.options.CPUOnly = value;
         } else {
            this.setError('wrongData', 'CPUOnly');
         }
      } catch (error) {
         this.setError('unexpected', 'CPUOnly');
      }
   }

   private checkRules(rules: string[]): void {
      let fileExists = true;
      for (const ruleFileName of rules) {
         try {
            if (ruleFileName.length > 0) {
               const files = FsUtils.listFileInDir(Constants.rulesPath);
               const fileHasBeenFound = files.find(file => {
                  return file === ruleFileName;
               });
               if (!fileHasBeenFound) {
                  fileExists = false;
                  this.setError('wrongData', 'rules');
               }
            }
         } catch (error) {
            this.setError('unexpected', 'rules');
         }
      }
      if (fileExists) this.options.rules = rules.join();
   }

   private checkPotfiles(name: string): void {
      try {
         if (name.length > 0) {
            const files = FsUtils.listFileInDir(Constants.potfilesPath);
            if (
               files.find(file => {
                  return file === name;
               })
            ) {
               this.options.potfileName = name;
            } else {
               this.setError('wrongData', 'potfile');
            }
         }
      } catch (error) {
         this.setError('unexpected', 'potfile');
      }
   }

   private findAttackModeWithId(id: number): Promise<AttackMode | null> {
      try {
         return this.dao.findAttackModeById(id);
      } catch {
         return new Promise(() => undefined);
      }
   }

   private sanitizeText(
      text: string,
      param: string,
      expectedLength = -1,
      spaceAreAllowed = false
   ): string {
      try {
         if (text.length > 0) {
            return expectedLength < 0
               ? this.removeSpecialCharInString(text)
               : this.shortenStringByLength(
                    expectedLength,
                    spaceAreAllowed
                       ? text
                       : this.removeSpecialCharInString(text)
                 );
         } else {
            this.setError('mandatory', param);
         }
      } catch (e) {
         this.setError('wrongData', param);
      }
      return 'unknow';
   }

   private isExpectedType(
      value: string | number | boolean,
      expectedType: string
   ): boolean {
      return typeof value === expectedType;
   }

   private async setTaskIfIsUpdate(id: number | undefined) {
      if (id) {
         this.task = await this.dao.task.getById(id);
         this.options = this.task.options;
         this.isAnUpdate = true;
      }
   }

   private setError(
      errorType: 'unexpected' | 'wrongData' | 'mandatory',
      fieldName: string
   ) {
      this.hasSucceded = false;
      let msg = '';
      switch (errorType) {
         case 'mandatory':
            msg = `Param ${fieldName} is mandatory`;
            break;
         case 'unexpected':
            msg = `An unexpected error occured with ${fieldName}`;
            break;
         case 'wrongData':
            msg = `Wrong data submitted for ${fieldName}`;
            break;
      }
      logger.debug(msg);
      this.errorMessages.push(msg);
   }
}
