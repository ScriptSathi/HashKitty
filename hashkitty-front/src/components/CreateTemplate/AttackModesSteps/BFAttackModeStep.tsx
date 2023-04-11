import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';
import CustomCharsetField from '../../HashcatFields/CustomCharsetField';
import MaskQueryField from '../../HashcatFields/MaskQueryField';

function BFAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, setValue }: AttackModeStepProps<Form>) {
   const fieldsProps = {
      register,
      errors,
      setValue,
      sx: { width: 300 },
   };
   return (
      <div className="flex flex-col items-center gap-y-10">
         <h3 className="text-lg">
            Specific configuration for Brute force attack
         </h3>
         <MaskQueryField<Form> {...fieldsProps} sx={{ width: 300 }} />
         <div className="mt-[15px] flex justify-between flex-wrap gap-x-5">
            <section className="flex flex-col gap-y-6 justify-between">
               <CustomCharsetField<Form> {...fieldsProps} charsetNumber={1} />
               <CustomCharsetField<Form> {...fieldsProps} charsetNumber={2} />
            </section>
            <section className="flex flex-col gap-y-6 justify-between">
               <CustomCharsetField<Form> {...fieldsProps} charsetNumber={3} />
               <CustomCharsetField<Form> {...fieldsProps} charsetNumber={4} />
            </section>
         </div>
      </div>
   );
}

export default BFAttackModeStep;
