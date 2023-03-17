import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { RadioOnChangeEvent, StandardList } from '../../../types/TComponents';

type RadiosProps<T extends StandardList, E extends FieldValues> = {
   list: T[];
   register: UseFormRegister<E>;
   onChangeElem?: (props: {
      event: RadioOnChangeEvent<number>;
      elem: T;
   }) => void;
   name: string;
   fieldName: FieldPath<E>;
   checkValidation?: (elem: T) => boolean | undefined;
};

export default function Radios<T extends StandardList, E extends FieldValues>({
   list,
   register,
   fieldName,
   name,
   onChangeElem = () => {},
   checkValidation = undefined,
}: RadiosProps<T, E>) {
   return (
      <>
         <h3 className="ml-[10px] text-lg text-gray-600">{name}</h3>
         <div className="h-[160px] w-[275px] overflow-y-scroll">
            <RadioGroup
               className="ml-[20px] flex-column"
               aria-labelledby="template-radio"
            >
               {list.map(elem => (
                  <FormControlLabel
                     key={elem.name}
                     sx={{ height: 25 }}
                     value={elem.id}
                     control={
                        <Radio
                           checked={
                              checkValidation
                                 ? checkValidation(elem)
                                 : undefined
                           }
                           color="secondary"
                        />
                     }
                     label={elem.name}
                     {...register(fieldName)}
                     onChange={event =>
                        onChangeElem({
                           event: event as RadioOnChangeEvent<number>,
                           elem,
                        })
                     }
                  />
               ))}
            </RadioGroup>
         </div>
      </>
   );
}

Radios.defaultProps = {
   onChangeElem: () => {},
   checkValidation: undefined,
};
