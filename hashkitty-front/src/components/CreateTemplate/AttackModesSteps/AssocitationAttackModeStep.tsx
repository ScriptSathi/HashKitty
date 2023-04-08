import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';

function AssocitationAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return <p>AssocitationAttackModeStep</p>;
}

export default AssocitationAttackModeStep;
