import { Path, PathValue } from 'react-hook-form';
import { type SxProps, type Theme } from '@mui/material';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';
import FormatList from '../../utils/FormatUtils';
import InputDropdown from '../ui/Inputs/InputDropdown';
import type { ListBase, ListItem } from '../../types/TApi';

type CombinatorAttackFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string | null>;
   wordlists: ListItem<ListBase>[];
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function CombinatorAttackField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   wordlists,
   sx,
}: CombinatorAttackFieldProps<Form>) {
   const [input, setInput] = customState ?? [undefined, () => {}];
   const fieldName = 'combinatorWordlistName' as Path<Form>;
   return (
      <InputDropdown<string, Form>
         register={register}
         options={FormatList.standard(wordlists)}
         errors={errors}
         formName={fieldName}
         label="Right wordlist *"
         sx={sx}
         value={input}
         onChange={(_, value) => {
            setInput(value as string);
            setValue(fieldName, (value as PathValue<Form, Path<Form>>) ?? '');
         }}
         isOptionEqualToValue={(option, value) =>
            option === value || value === ''
         }
      />
   );
}

CombinatorAttackField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default CombinatorAttackField;
