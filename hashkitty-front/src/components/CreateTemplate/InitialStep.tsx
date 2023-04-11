import { Dispatch, SetStateAction } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { TextField } from '@mui/material';
import {
   AttackModeAvailable,
   CreateTemplateForm,
} from '../../types/TComponents';
import { TAttackMode } from '../../types/TypesORM';
import FormatList from '../../utils/FormatUtils';
import Radios from '../ui/Radios/Radios';

type InitialStepProps = {
   inputAttackMode: [
      { id: number; mode: AttackModeAvailable },
      Dispatch<SetStateAction<{ id: number; mode: AttackModeAvailable }>>,
   ];
   attackModes: TAttackMode[];
   register: UseFormRegister<CreateTemplateForm>;
   errors: FieldErrors<CreateTemplateForm>;
};

function InitialStep({
   inputAttackMode: [inputAttackMode, setInputAttackMode],
   attackModes,
   register,
   errors,
}: InitialStepProps) {
   return (
      <section className="flex flex-col items-center mx-10 gap-2">
         <TextField
            className="w-[400px]"
            {...register('name', {
               maxLength: {
                  value: 20,
                  message: 'Must be shorter than 20 characters',
               },
            })}
            error={!!errors.name && !!errors.name.message}
            label="Template name *"
            helperText={errors.name?.message}
            sx={{ marginTop: 0.5 }}
         />
         <div className="mt-[40px]">
            <Radios<TAttackMode, CreateTemplateForm>
               name="Attack modes"
               fieldName="attackModeId"
               list={FormatList.attackMode(attackModes)}
               register={register}
               errors={errors}
               checkValidation={elem => elem.id === inputAttackMode.id}
               onChangeElem={({ elem }) => setInputAttackMode(elem)}
            />
         </div>
      </section>
   );
}

export default InitialStep;
