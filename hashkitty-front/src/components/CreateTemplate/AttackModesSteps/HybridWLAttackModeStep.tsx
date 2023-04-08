import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';

function HybridWLAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return <p>HybridWLAttackModeStep</p>;
}

export default HybridWLAttackModeStep;
