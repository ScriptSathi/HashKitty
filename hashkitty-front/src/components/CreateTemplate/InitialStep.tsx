import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { TextField } from '@mui/material';
import type { CreateTemplateForm, TUseState } from '../../types/TComponents';
import type { TAttackMode } from '../../types/TypesORM';
import AttackModeRadio from '../HashcatFields/AttackModeRadio';

type InitialStepProps = {
   inputAttackMode: TUseState<TAttackMode>;
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
            <AttackModeRadio<CreateTemplateForm>
               customState={[inputAttackMode, setInputAttackMode]}
               attackModes={attackModes}
               register={register}
               errors={errors}
            />
         </div>
      </section>
   );
}

export default InitialStep;
