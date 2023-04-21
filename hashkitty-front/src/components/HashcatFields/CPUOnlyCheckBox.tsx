import { Path, PathValue } from 'react-hook-form';
import { useState } from 'react';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';
import CheckBox from '../ui/Inputs/CheckBox';

type CPUOnlyCheckBoxProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<boolean>;
   className?: string;
} & FieldProps<Form>;

function CPUOnlyCheckBox<Form extends CreateTemplateForm>({
   register,
   setValue,
   className,
   customState = undefined,
}: CPUOnlyCheckBoxProps<Form>) {
   const state = useState(false);
   const [inputCheck, setCheck] = customState ?? state;

   const fieldName = 'cpuOnly' as Path<Form>;
   return (
      <CheckBox<Form>
         className={className}
         title="CPU only"
         name={fieldName}
         register={register}
         checked={inputCheck}
         onClick={() => {
            setValue(fieldName, !inputCheck as PathValue<Form, Path<Form>>);
            setCheck(!inputCheck);
         }}
      />
   );
}

CPUOnlyCheckBox.defaultProps = {
   customState: undefined,
   className: '',
};

export default CPUOnlyCheckBox;
