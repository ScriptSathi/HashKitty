import { Path } from 'react-hook-form';
import type {
   CreateTemplateForm,
   FieldProps,
   TUseState,
} from '../../types/TComponents';
import FormatList from '../../utils/FormatUtils';
import Radios from '../ui/Radios/Radios';
import type { TAttackMode } from '../../types/TypesORM';

type AttackModeProps<Form extends CreateTemplateForm> = {
   customState?: TUseState<TAttackMode>;
   attackModes: TAttackMode[];
} & FieldProps<Form>;

function AttackModeRadio<Form extends CreateTemplateForm>({
   register,
   errors,
   attackModes,
   customState,
}: AttackModeProps<Form>) {
   const [input, setInput] = customState ?? [
      { id: -1, name: '', mode: 0 },
      () => {},
   ];
   const fieldName = 'attackModeId' as Path<Form>;
   return (
      <Radios<TAttackMode, Form>
         name="Attack modes"
         fieldName={fieldName}
         list={FormatList.attackMode(attackModes)}
         register={register}
         errors={errors}
         checkValidation={elem => elem.mode === input.mode}
         onChangeElem={({ elem }) => setInput(elem)}
         useAttackModeTooltips
      />
   );
}

AttackModeRadio.defaultProps = {
   customState: [{ id: -1, name: '', mode: 0 }, () => {}],
};

export default AttackModeRadio;
