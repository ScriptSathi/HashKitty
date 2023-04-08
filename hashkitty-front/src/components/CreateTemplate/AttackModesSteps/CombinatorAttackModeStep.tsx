import { Path, PathValue } from 'react-hook-form';
import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';
import InputDropdown from '../../ui/Inputs/InputDropdown';
import FormatList from '../../../utils/FormatUtils';

function CombinatorAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return (
      <div className="flex flex-col items-center gap-y-10">
         <h3 className="text-lg">
            Specific configuration for Combinator attack
         </h3>
         <InputDropdown<string, Form>
            register={register}
            options={FormatList.standard(DBData.wordlists)}
            errors={errors}
            formName={'wordlistName' as Path<Form>}
            label="Left wordlist"
            isOptionEqualToValue={(option, value) =>
               option === value || value === null
            }
            onChange={(_, value) =>
               setValue(
                  'wordlistName' as Path<Form>,
                  (value as PathValue<Form, Path<Form>>) ?? '',
               )
            }
         />
         <InputDropdown<string, Form>
            register={register}
            options={FormatList.standard(DBData.wordlists)}
            errors={errors}
            formName={'combinatorWordlistName' as Path<Form>}
            label="Right wordlist"
            isOptionEqualToValue={(option, value) =>
               option === value || value === null
            }
            onChange={(_, value) =>
               setValue(
                  'combinatorWordlistName' as Path<Form>,
                  (value as PathValue<Form, Path<Form>>) ?? '',
               )
            }
         />
      </div>
   );
}

export default CombinatorAttackModeStep;
