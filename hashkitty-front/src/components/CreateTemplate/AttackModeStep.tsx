import type {
   FieldErrors,
   UseFormRegister,
   UseFormSetValue,
} from 'react-hook-form';
import type {
   AttackModeAvailable,
   CreateTemplateForm,
} from '../../types/TComponents';
import AssocitationAttackModeStep from './AttackModesSteps/AssocitationAttackModeStep';
import BFAttackModeStep from './AttackModesSteps/BFAttackModeStep';
import CombinatorAttackModeStep from './AttackModesSteps/CombinatorAttackModeStep';
import HybridMaskAttackModeStep from './AttackModesSteps/HybridMaskAttackModeStep';
import HybridWLAttackModeStep from './AttackModesSteps/HybridWLAttackModeStep';
import StraightAttackModeStep from './AttackModesSteps/StraightAttackModeStep';
import type { TDBData } from '../../types/TypesErrorHandler';

type AttackModeStepProps<Form extends CreateTemplateForm> = {
   attackMode: AttackModeAvailable;
   setValue: UseFormSetValue<Form>;
   register: UseFormRegister<Form>;
   errors: FieldErrors<Form>;
   DBData: Omit<TDBData, 'templates' | 'hashtypes'>;
};

function AttackModeStep<Form extends CreateTemplateForm = CreateTemplateForm>({
   attackMode,
   ...otherProps
}: AttackModeStepProps<Form>) {
   switch (attackMode) {
      case 0:
         return <StraightAttackModeStep {...otherProps} />;
      case 1:
         return <CombinatorAttackModeStep {...otherProps} />;
      case 3:
         return <BFAttackModeStep {...otherProps} />;
      case 6:
         return <HybridMaskAttackModeStep {...otherProps} />;
      case 7:
         return <HybridWLAttackModeStep {...otherProps} />;
      case 9:
         return <AssocitationAttackModeStep {...otherProps} />;
      default:
         return (
            <p className="text-red-700">
               An error occured, the requested attack mode {attackMode} does not
               exist
            </p>
         );
   }
}

export default AttackModeStep;
