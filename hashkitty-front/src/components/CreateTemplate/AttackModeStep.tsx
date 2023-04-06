import { AttackModeAvailable } from '../../types/TComponents';
import AssocitationAttackModeStep from './AttackModesSteps/AssocitationAttackModeStep';
import BFAttackModeStep from './AttackModesSteps/BFAttackModeStep';
import CombinatorAttackModeStep from './AttackModesSteps/CombinatorAttackModeStep';
import HybridMaskAttackModeStep from './AttackModesSteps/HybridMaskAttackModeStep';
import HybridWLAttackModeStep from './AttackModesSteps/HybridWLAttackModeStep';
import StraightAttackModeStep from './AttackModesSteps/StraightAttackModeStep';

type AttackModeStepProps = {
   attackMode: AttackModeAvailable;
};

function AttackModeStep({ attackMode }: AttackModeStepProps) {
   switch (attackMode) {
      case 0:
         return <StraightAttackModeStep />;
      case 1:
         return <CombinatorAttackModeStep />;
      case 3:
         return <BFAttackModeStep />;
      case 6:
         return <HybridMaskAttackModeStep />;
      case 7:
         return <HybridWLAttackModeStep />;
      case 9:
         return <AssocitationAttackModeStep />;
      default:
         <p className='text-red-700'>
            An error occured, the requested attack mode {attackMode} does not
            exist
         </p>;
   }
}
