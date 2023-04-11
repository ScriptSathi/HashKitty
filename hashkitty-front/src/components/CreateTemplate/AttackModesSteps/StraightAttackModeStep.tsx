import type { Path, PathValue } from 'react-hook-form';
import { Chip } from '@mui/material';
import type {
   AttackModeStepProps,
   CreateTemplateForm,
} from '../../../types/TComponents';
import FormatList from '../../../utils/FormatUtils';
import InputDropdown from '../../ui/Inputs/InputDropdown';
import WordlistField from '../../HashcatFields/WordlistField';

function StraightAttackModeStep<
   Form extends CreateTemplateForm = CreateTemplateForm,
>({ register, errors, DBData, setValue }: AttackModeStepProps<Form>) {
   return (
      <div className="flex flex-col items-center gap-y-10">
         <h3 className="text-lg">Specific configuration for Straight attack</h3>
         <WordlistField<Form>
            register={register}
            wordlists={DBData.wordlists}
            errors={errors}
            setValue={setValue}
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
               rules.map((rule, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                     <Chip
                        key={rule}
                        variant="outlined"
                        label={rule}
                        color="secondary"
                        {...tagProps}
                     />
                  );
               })
            }
         />
      </div>
   );
}

export default StraightAttackModeStep;
