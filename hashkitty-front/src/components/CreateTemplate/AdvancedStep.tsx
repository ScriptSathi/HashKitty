import type {
   FieldErrors,
   UseFormRegister,
   UseFormSetValue,
} from 'react-hook-form';

import type { CreateTemplateForm } from '../../types/TComponents';
import type { TDBData } from '../../types/TypesErrorHandler';
import BreakPointTempField from '../HashcatFields/BreakPointTempField';
import WorkloadProfileField from '../HashcatFields/WorkloadProfileField';
import PotfileField from '../HashcatFields/PotfileField';
import CPUOnlyCheckBox from '../HashcatFields/CPUOnlyCheckBox';
import KernelOptiCheckBox from '../HashcatFields/KernelOptiCheckBox';

type AdvancedStepProps<Form extends CreateTemplateForm> = {
   register: UseFormRegister<Form>;
   DBData: Omit<TDBData, 'templates' | 'hashtypes'>;
   setValue: UseFormSetValue<Form>;
   errors: FieldErrors<Form>;
};

function AdvancedStep<Form extends CreateTemplateForm = CreateTemplateForm>({
   register,
   errors,
   setValue,
   DBData: { potfiles },
}: AdvancedStepProps<Form>) {
   const fieldsProps = {
      register,
      errors,
      setValue,
   };
   return (
      <div className="flex flex-wrap mt-10 flex-col gap-y-3">
         <section className="flex flex-wrap gap-2 justify-between">
            <PotfileField<Form>
               potfiles={potfiles}
               {...fieldsProps}
               sx={{ width: 300 }}
            />
         </section>
         <section className="flex justify-between">
            <KernelOptiCheckBox<Form> className="self-end" {...fieldsProps} />
            <BreakPointTempField {...fieldsProps} sx={{ width: 160 }} />
         </section>
         <section className="flex justify-between">
            <CPUOnlyCheckBox<Form> className="self-start" {...fieldsProps} />
            <WorkloadProfileField {...fieldsProps} sx={{ width: 160 }} />
         </section>
      </div>
   );
}

export default AdvancedStep;
