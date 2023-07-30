import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import {
   FieldError,
   FieldErrors,
   Path,
   UseFormRegister,
} from 'react-hook-form';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useContext } from 'react';
import ColorModeContext from '../../../App/ColorModeContext';

type InputDropdownProps<Item extends object | string, Form extends object> = {
   label: string;
   options: Item[];
   register: UseFormRegister<Form>;
   errors: FieldErrors<Form>;
   formName: Path<Form>;
   value?: Item | undefined | null;
   width?: number;
   disablePortal?: boolean;
   isMultiple?: boolean | undefined;
   onChange?: (
      event: React.SyntheticEvent<Element, Event>,
      value: Item | Item[] | null,
   ) => void;
   getOptionLabel?: (elem: Item) => string;
   isOptionEqualToValue?: (option: Item, value: Item) => boolean;
} & Partial<AutocompleteProps<Item, boolean, boolean, boolean>>;

export default function InputDropdown<
   Item extends object | string,
   Form extends object,
>({
   label,
   options,
   getOptionLabel,
   width,
   register,
   formName,
   errors,
   disablePortal,
   value,
   onChange,
   isMultiple,
   isOptionEqualToValue,
   ...autoCompleteProps
}: InputDropdownProps<Item, Form>) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   return (
      <Autocomplete<Item, boolean, boolean, boolean>
         multiple={isMultiple}
         disablePortal={disablePortal}
         options={options}
         getOptionLabel={getOptionLabel}
         isOptionEqualToValue={isOptionEqualToValue}
         {...autoCompleteProps}
         sx={{ width, overflow: 'auto', paddingTop: 0.6 }}
         popupIcon={<ArrowDropDownIcon sx={{ color: colors.font }} />}
         renderInput={params => (
            <TextField
               {...params}
               style={{ maxHeight: 200 }}
               label={label}
               error={
                  !!(errors[formName] as FieldError) &&
                  !!(errors[formName] as FieldError).message
               }
               helperText={errors[formName]?.message as string}
            />
         )}
         value={value}
         {...register(formName)}
         onChange={onChange}
      />
   );
}

InputDropdown.defaultProps = {
   getOptionLabel: (e: object | string) => e,
   onChange: undefined,
   width: 300,
   disablePortal: false,
   value: undefined,
   isMultiple: undefined,
   isOptionEqualToValue: (option: string, value: string) => option === value,
};
