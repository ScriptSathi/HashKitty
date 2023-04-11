import { Path, PathValue } from 'react-hook-form';
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
   customState,
   className,
}: CPUOnlyCheckBoxProps<Form>) {
   const [inputCheck, setCheck] = customState ?? [false, () => {}];
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
   customState: [false, () => {}],
   className: '',
};

export default CPUOnlyCheckBox;
