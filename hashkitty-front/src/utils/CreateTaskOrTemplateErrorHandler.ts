import { UseFormSetError } from 'react-hook-form';
import ErrorHandler from './ErrorHandler';
import {
   CreateTaskErrors,
   CreateTemplateErrors,
   TDBData,
} from '../types/TypesErrorHandler';
import { CreateTaskForm, CreateTemplateForm } from '../types/TComponents';
import { THashlist } from '../types/TypesORM';
import { TaskUpdate } from '../types/TApi';

export default class CreateTaskOrTemplateErrorHandler<
   FormError extends CreateTaskErrors | CreateTemplateErrors,
> extends ErrorHandler<FormError> {
   public finalForm: TaskUpdate;
   private setError: UseFormSetError<CreateTaskForm>;
   private dbData: Omit<TDBData, 'hashtypes' | 'templates'> &
      Partial<Pick<TDBData, 'templates'>>;
   constructor(
      setError: UseFormSetError<CreateTaskForm>,
      dbData: Omit<TDBData, 'hashtypes' | 'templates'> &
         Partial<Pick<TDBData, 'templates'>>,
   ) {
      super();
      this.setError = setError;
      this.dbData = dbData;
      this.finalForm = {
         name: '',
         description: 'Not done yet, sorry bro',
         hashlistId: -1,
         options: {
            attackModeId: -1,
            breakpointGPUTemperature: 90,
            wordlistName: '',
            workloadProfileId: 1,
            kernelOpti: false,
            CPUOnly: false,
            maskQuery: '',
         },
      };
   }

   public analyseTask(form: CreateTaskForm): void {
      this.isValid = true;
      this.checkName(form.name);
      this.checkTemplate(form.templateId);
      this.checkAttackMode(form.attackModeId);
      this.checkHashlist(form.hashlistName);
      this.checkWordlist(form.wordlistName);
      this.checkRules(form.rules);
      this.checkPotfiles(form.potfileName);
      this.checkWorkloadProfile(form.workloadProfile);
      this.checkBreakpointTemp(form.breakpointGPUTemperature);

      this.finalForm.options.kernelOpti = form.kernelOpti;
      this.finalForm.options.CPUOnly = form.cpuOnly;
      this.finalForm.options.maskQuery = form.maskQuery;
   }

   public analyseTemplate(form: CreateTemplateForm): void {
      this.isValid = true;
      this.checkName(form.name);
      this.checkAttackMode(form.attackModeId);
      this.checkWordlist(form.wordlistName);
      this.checkRules(form.rules);
      this.checkPotfiles(form.potfileName);
      this.checkWorkloadProfile(form.workloadProfile);
      this.checkBreakpointTemp(form.breakpointGPUTemperature);

      this.finalForm.options.kernelOpti = form.kernelOpti;
      this.finalForm.options.CPUOnly = form.cpuOnly;
      this.finalForm.options.maskQuery = form.maskQuery;
   }

   public analyseFirstStepTemplate(form: CreateTemplateForm): void {
      this.isValid = true;
      this.checkName(form.name);
      this.checkAttackMode(form.attackModeId);
   }

   public analyseSecondStepTemplate(form: CreateTemplateForm): void {
      this.isValid = true;
      this.checkName(form.name);
      this.checkAttackMode(form.attackModeId);
      this.checkWordlist(form.wordlistName);
      this.checkRules(form.rules);
      this.checkPotfiles(form.potfileName);
      this.checkWorkloadProfile(form.workloadProfile);
      this.checkBreakpointTemp(form.breakpointGPUTemperature);
   }

   private checkTemplate(templateId: number) {
      const templates = this.dbData.templates ?? [];
      const find = templates.find(elem => {
         return elem.item.id === templateId;
      });
      if (!find && templateId > 0) {
         this.setError('templateId', {
            message: this.wrongData.message,
         });
      } else if (find) {
         this.finalForm.templateTaskId = find.item.id;
      }
   }

   private checkName(name: string): void {
      if (name.length === 0) {
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
         this.setError('wordlistName', {
            message: this.requieredFields.message,
         });
      } else if (find) {
         this.finalForm.options.wordlistName = name;
      } else {
         this.setError('wordlistName', { message: this.wrongData.message });
      }
   }

   private checkHashlist(name: THashlist['name']): void {
      const find = this.dbData.hashlists.find(elem => {
         return elem.item.name === name;
      });
      if (!find && name.length <= 0) {
         this.setError('hashlistName', {
            message: this.requieredFields.message,
         });
      } else if (!find && name.length > 0) {
         this.setError('hashlistName', { message: this.wrongData.message });
      } else if (find) {
         this.finalForm.hashlistId = find.item.id;
      }
   }

   private checkRules(rules: string[]): void {
      rules.map(rule => {
         const find = this.dbData.rules.find(elem => {
            return elem.item.name === rule;
         });
         if (!find && rule.length !== 0) {
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
         this.setError('potfileName', { message: this.wrongData.message });
      } else if (find) {
         this.finalForm.options.potfileName = name;
      }
   }

   private checkBreakpointTemp(temp: number) {
      if (temp > 110 || temp < 0 || typeof temp !== 'number') {
         this.setError('breakpointGPUTemperature', {
            message: this.wrongData.message,
         });
      } else {
         this.finalForm.options.breakpointGPUTemperature = temp;
      }
   }

   private checkWorkloadProfile(profile: number) {
      if (profile > 4 || profile < 0 || typeof profile !== 'number') {
         this.setError('workloadProfile', { message: this.wrongData.message });
      } else {
         this.finalForm.options.workloadProfileId = profile;
      }
   }
}