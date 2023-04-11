import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';
import WordlistField from '../../HashcatFields/WordlistField';
import MaskQueryField from '../../HashcatFields/MaskQueryField';

function HybridWLAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   const fieldsProps = {
      register,
      errors,
      setValue,
   };
   return (
      <div className="flex flex-col items-center gap-y-10">
         <h3 className="text-lg">Specific configuration for Hybrid attack</h3>
         <MaskQueryField<Form> {...fieldsProps} sx={{ width: 300 }} />
         <WordlistField<Form> wordlists={DBData.wordlists} {...fieldsProps} />
      </div>
   );
}

export default HybridWLAttackModeStep;
