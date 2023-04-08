import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';

function HybridMaskAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return <p>HybridMaskAttackModeStep</p>;
}

export default HybridMaskAttackModeStep;
