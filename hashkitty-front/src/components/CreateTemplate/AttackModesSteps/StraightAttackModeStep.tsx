import type {
   FieldErrors,
   Path,
   PathValue,
   UseFormRegister,
   UseFormSetValue,
} from 'react-hook-form';
import { Chip } from '@mui/material';
import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';
import type { TDBData } from '../../../types/TypesErrorHandler';
import FormatList from '../../../utils/FormatUtils';
import InputDropdown from '../../ui/Inputs/InputDropdown';

function StraightAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return (
      <div className="flex flex-col items-center gap-y-10">
         <h3 className="text-lg">Specific configuration for Straight attack</h3>
         <InputDropdown<string, Form>
            register={register}
            options={FormatList.standard(DBData.wordlists)}
            errors={errors}
            formName={'wordlistName' as Path<Form>}
            label="Wordlists"
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
            isMultiple
            register={register}
            options={FormatList.standard(DBData.rules)}
            errors={errors}
            formName={'rules' as Path<Form>}
            label="Rules"
            isOptionEqualToValue={(option, value) =>
               option === value || value === null
            }
            onChange={(_, value) =>
               setValue(
                  'rules' as Path<Form>,
                  (value as PathValue<Form, Path<Form>>) ?? [],
               )
            }
            renderTags={(rules, getTagProps) =>
               rules.map((rule, index) => (
                  <Chip
                     variant="outlined"
                     label={rule}
                     color="secondary"
                     {...getTagProps({ index })}
                  />
               ))
            }
         />
      </div>
   );
}

export default StraightAttackModeStep;
