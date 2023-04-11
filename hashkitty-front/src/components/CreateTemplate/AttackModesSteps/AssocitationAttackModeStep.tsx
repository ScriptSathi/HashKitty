import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';
import WordlistField from '../../HashcatFields/WordlistField';

function AssocitationAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return (
      <div className="flex flex-col items-center gap-y-10">
         <h3 className="text-lg">
            Specific configuration for association attack
         </h3>
         <WordlistField<Form>
            wordlists={DBData.wordlists}
            register={register}
            errors={errors}
            setValue={setValue}
         />
      </div>
   );
}

export default AssocitationAttackModeStep;
