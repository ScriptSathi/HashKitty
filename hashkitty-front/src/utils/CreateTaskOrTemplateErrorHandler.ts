import { UseFormSetError } from 'react-hook-form';
import ErrorHandler from './ErrorHandler';
import type {
   CreateTaskErrors,
   CreateTemplateErrors,
   TDBData,
} from '../types/TypesErrorHandler';
import type { CreateTaskForm, CreateTemplateForm } from '../types/TComponents';
import type { THashlist } from '../types/TypesORM';
import type { TaskUpdate, TemplateUpdate } from '../types/TApi';

export default class CreateTaskOrTemplateErrorHandler<
   FormError extends CreateTaskErrors | CreateTemplateErrors,
> extends ErrorHandler<FormError> {
   public finalForm: TaskUpdate | TemplateUpdate;
   public isValid: boolean;
   private setError: UseFormSetError<CreateTaskForm>;
   private dbData: Omit<TDBData, 'hashtypes' | 'templates'> &
      Partial<Pick<TDBData, 'templates'>>;
   constructor(
      setError: UseFormSetError<CreateTaskForm>,
      dbData: Omit<TDBData, 'hashtypes' | 'templates'> &
         Partial<Pick<TDBData, 'templates'>>,
   ) {
      super();
      this.isValid = true;
      this.setError = setError;
      this.dbData = dbData;
      this.finalForm = this.setDefaultFinalForm();
   }

   public analyseTask(form: CreateTaskForm, attackMode: number): void {
      this.checkHashlist(form.hashlistName);
      this.checkTemplate(parseInt(form.templateId, 10));
      this.analyseFirstStepTemplate(form);
      this.analyseSecondStepTemplate(form, attackMode);
      this.analyseAdvancedParam(form);
   }

   public analyseTemplate(form: CreateTemplateForm, attackMode: number): void {
      this.analyseFirstStepTemplate(form);
      this.analyseSecondStepTemplate(form, attackMode);
      this.analyseAdvancedParam(form);
   }

   public analyseFirstStepTemplate(form: CreateTemplateForm): void {
      this.checkName(form.name);
      this.checkAttackMode(form.attackModeId);
   }

   public analyseSecondStepTemplate(
      form: CreateTemplateForm,
      attackMode: number,
   ): void {
      this.checkName(form.name);
      this.checkAttackMode(form.attackModeId);

      switch (attackMode) {
         case 0:
            this.checkWordlist(form.wordlistName);
            this.checkRules(form.rules);
            break;
         case 1:
            this.checkWordlist(form.wordlistName);
            this.checkCombinatorWordlist(form.combinatorWordlistName);
            break;
         case 3:
            this.checkMaskQuery(form.maskQuery, true);
            this.checkCustomCharset(form.customCharset1, 1);
            this.checkCustomCharset(form.customCharset2, 2);
            this.checkCustomCharset(form.customCharset3, 3);
            this.checkCustomCharset(form.customCharset4, 4);
            break;
         case 6:
            this.checkWordlist(form.wordlistName);
            this.checkMaskQuery(form.maskQuery);
            break;
         case 7:
            this.checkWordlist(form.wordlistName);
            this.checkMaskQuery(form.maskQuery);
            break;
         case 9:
            this.checkWordlist(form.wordlistName);
            break;
         default:
            throw new Error(`The attack mode ${attackMode} is not defined`);
      }
   }

   private analyseAdvancedParam(form: CreateTemplateForm) {
      this.checkPotfiles(form.potfileName);
      this.checkWorkloadProfile(parseInt(form.workloadProfile, 10));
      this.checkBreakpointTemp(parseInt(form.breakpointGPUTemperature, 10));
      this.finalForm.options.kernelOpti = form.kernelOpti;
      this.finalForm.options.CPUOnly = form.cpuOnly;
      this.finalForm.options.maskQuery = form.maskQuery;
   }

   private checkTemplate(templateId: number) {
      const templates = this.dbData.templates ?? [];
      const find = templates.find(elem => {
         return elem.item.id === templateId;
      });
      if (!find && templateId > 0) {
         this.isValid = false;
         this.setError('templateId', {
            message: this.wrongData.message,
         });
      } else if (find) {
         (this.finalForm as TaskUpdate).templateTaskId = find.item.id;
      }
   }

   private checkName(name: string): void {
      if (name.length === 0) {
         this.isValid = false;
         this.setError('name', { message: this.requieredFields.message });
      } else {
         this.finalForm.name = name;
      }
   }

   private checkAttackMode(attackModeId: string): void {
      const find = this.dbData.attackModes.find(elem => {
         return elem.id.toString() === attackModeId;
      });
      if (!find) {
         this.isValid = false;
         this.setError('attackModeId', {
            message: this.requieredFields.message,
         });
      } else {
         this.finalForm.options.attackModeId = find.id;
      }
   }

   private checkWordlist(name: string): void {
      const find = this.dbData.wordlists.find(elem => {
         return elem.item.name === name;
      });
      if (!find) {
         this.isValid = false;
         this.setError('wordlistName', {
            message: this.requieredFields.message,
         });
      } else if (find) {
         this.finalForm.options.wordlistName = name;
      } else {
         this.isValid = false;
         this.setError('wordlistName', { message: this.wrongData.message });
      }
   }

   private checkCombinatorWordlist(name: string): void {
      const find = this.dbData.wordlists.find(elem => {
         return elem.item.name === name;
      });

      if (!find) {
         this.isValid = false;
         this.setError('combinatorWordlistName', {
            message: this.requieredFields.message,
         });
      } else if (find) {
         this.finalForm.options.combinatorWordlistName = name;
      }
   }

   private checkMaskQuery(query: string, isMandatory = false) {
      const validQueries = query.match(/^[\w?]*$/gi);
      const queryIsEmpty = query.length === 0;

      if (!!validQueries && !queryIsEmpty) {
         this.finalForm.options.maskQuery = query;
      } else if (isMandatory && queryIsEmpty) {
         this.isValid = false;
         this.setError('maskQuery', {
            message: this.requieredFields.message,
         });
      } else {
         this.isValid = false;
         this.setError('maskQuery', {
            message: this.wrongData.message,
         });
      }
   }

   private checkCustomCharset(query: string, charset: 1 | 2 | 3 | 4) {
      const validQueries = query.match(/^[\w?]*$/gi);
      const queryIsSet = query.length > 0;
      if (!!validQueries && queryIsSet) {
         this.finalForm.options[`customCharset${charset}`] = query;
      } else if (queryIsSet) {
         this.isValid = false;
         this.setError(`customCharset${charset}`, {
            message: this.wrongData.message,
         });
      }
   }

   private checkHashlist(name: THashlist['name']): void {
      const find = this.dbData.hashlists.find(elem => {
         return elem.item.name === name;
      });
      if (!find && name.length <= 0) {
         this.isValid = false;
         this.setError('hashlistName', {
            message: this.requieredFields.message,
         });
      } else if (!find && name.length > 0) {
         this.isValid = false;
         this.setError('hashlistName', { message: this.wrongData.message });
      } else if (find) {
         (this.finalForm as TaskUpdate).hashlistId = find.item.id;
      }
   }

   private checkRules(rules: string[]): void {
      rules.map(rule => {
         const find = this.dbData.rules.find(elem => {
            return elem.item.name === rule;
         });
         if (!find && rule.length !== 0) {
            this.isValid = false;
            this.setError('rules', { message: this.wrongData.message });
         } else if (find) {
            this.finalForm.options.rules = rules;
         }
         return rule;
      });
   }

   private checkPotfiles(name: string): void {
      const find = this.dbData.potfiles.find(elem => {
         return elem.item.name === name;
      });
      if (!find && name.length !== 0) {
         this.isValid = false;
         this.setError('potfileName', { message: this.wrongData.message });
      } else if (find) {
         this.finalForm.options.potfileName = name;
      }
   }

   private checkBreakpointTemp(temp: number) {
      if (temp > 110 || temp < 0 || typeof temp !== 'number') {
         this.isValid = false;
         this.setError('breakpointGPUTemperature', {
            message: this.wrongData.message,
         });
      } else {
         this.finalForm.options.breakpointGPUTemperature = temp;
      }
   }

   private checkWorkloadProfile(profile: number) {
      if (profile > 4 || profile < 0 || typeof profile !== 'number') {
         this.isValid = false;
         this.setError('workloadProfile', { message: this.wrongData.message });
      } else {
         this.finalForm.options.workloadProfileId = profile;
      }
   }

   private setDefaultFinalForm(): TaskUpdate | TemplateUpdate {
      const isTaskUpdate = !!this.dbData.templates;
      const minimalDefault = {
         name: '',
         description: 'No description',
         options: {
            attackModeId: -1,
            breakpointGPUTemperature: 90,
            wordlistName: '',
            workloadProfileId: 1,
            kernelOpti: false,
            CPUOnly: false,
            maskQuery: '',
            combinatorWordlistName: '',
            rules: [],
            customCharset1: '',
            customCharset2: '',
            customCharset3: '',
            customCharset4: '',
         },
      } satisfies TemplateUpdate;
      if (isTaskUpdate) {
         return {
            hashlistId: -1,
            templateTaskId: -1,
            ...minimalDefault,
         } satisfies TaskUpdate;
      }
      return minimalDefault;
   }
}
