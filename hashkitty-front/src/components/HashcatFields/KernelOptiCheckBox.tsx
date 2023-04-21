import { useState } from 'react';
import { Path, PathValue } from 'react-hook-form';
import {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';
import CheckBox from '../ui/Inputs/CheckBox';

type KernelOptiCheckBoxProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<boolean>;
   className?: string;
} & FieldProps<Form>;

function KernelOptiCheckBox<Form extends CreateTemplateForm>({
   register,
   setValue,
   className,
   customState = undefined,
}: KernelOptiCheckBoxProps<Form>) {
   const state = useState(false);
   const [inputCheck, setCheck] = customState ?? state;
   const fieldName = 'kernelOpti' as Path<Form>;
   return (
      <CheckBox<Form>
         className={className}
         title="Kernel optimization"
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

KernelOptiCheckBox.defaultProps = {
   customState: undefined,
   className: '',
};

export default KernelOptiCheckBox;
