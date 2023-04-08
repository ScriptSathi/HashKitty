import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';

function BFAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return <p>BFAttackModeStep</p>;
}

export default BFAttackModeStep;
