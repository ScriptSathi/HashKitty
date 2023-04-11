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

type WordlistFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string | null>;
   wordlists: ListItem<ListBase>[];
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function WordlistField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   wordlists,
   sx,
}: WordlistFieldProps<Form>) {
   const [input, setInput] = customState ?? [undefined, () => {}];
   const fieldName = 'wordlistName' as Path<Form>;
   return (
      <InputDropdown<string, Form>
         register={register}
         options={FormatList.standard(wordlists)}
         errors={errors}
         sx={sx}
         formName={fieldName}
         value={input}
         label="Wordlists *"
         onChange={(_, value) => {
            setInput(value as string);
            setValue(fieldName, (value as PathValue<Form, Path<Form>>) ?? '');
         }}
         isOptionEqualToValue={(option, value) =>
            option === value || value === null
         }
      />
   );
}

WordlistField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default WordlistField;
