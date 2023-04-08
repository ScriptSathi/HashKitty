import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';

function CombinatorAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return <p>CombinatorAttackModeStep</p>;
}

export default CombinatorAttackModeStep;
