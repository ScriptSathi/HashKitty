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

type PotfileFieldProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<string | null>;
   potfiles: ListItem<ListBase>[];
   sx?: SxProps<Theme> | undefined;
} & FieldProps<Form>;

function PotfileField<Form extends CreateTemplateForm>({
   register,
   errors,
   setValue,
   customState,
   potfiles,
   sx,
}: PotfileFieldProps<Form>) {
   const [input, setInput] = customState ?? [undefined, () => {}];
   const fieldName = 'potfileName' as Path<Form>;
   return (
      <InputDropdown<string, Form>
         register={register}
         options={FormatList.standard(potfiles)}
         errors={errors}
         sx={sx}
         formName={fieldName}
         label="Potfiles"
         value={input}
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

PotfileField.defaultProps = {
   customState: [undefined, () => {}],
   sx: undefined,
};

export default PotfileField;
