import { FormControlLabel, Radio, RadioGroup, Tooltip } from '@mui/material';
import {
   FieldErrors,
   FieldValues,
   Path,
   UseFormRegister,
} from 'react-hook-form';
import { RadioOnChangeEvent, StandardList } from '../../../types/TComponents';
import tooltips from '../../../tooltips';

type RadiosProps<T extends StandardList, Form extends FieldValues> = {
   list: T[];
   register: UseFormRegister<Form>;
   onChangeElem?: (props: {
      event: RadioOnChangeEvent<number>;
      elem: T;
   }) => void;
   name: string;
   fieldName: Path<Form>;
   errors?: FieldErrors<Form> | undefined;
   useTemplateTooltips?: boolean | undefined;
   useAttackModeTooltips?: boolean | undefined;
   checkValidation?: (elem: T) => boolean | undefined;
};

export default function Radios<
   T extends StandardList,
   Form extends FieldValues,
>({
   list,
   register,
   fieldName,
   name,
   errors,
   useTemplateTooltips,
   useAttackModeTooltips,
   onChangeElem = () => {},
   checkValidation = undefined,
}: RadiosProps<T, Form>) {
   const errorMessage = () => {
      if (errors && errors[fieldName]) {
         return errors[fieldName]?.message as string;
      }
      return '';
   };

   const getTooltip = (item: T): string => {
      if (useAttackModeTooltips) {
         return tooltips.inputs.attackModes[item.mode ?? 0];
      }
      if (useTemplateTooltips) {
         return tooltips.inputs.templates(item.name);
      }
      return '';
   };

   if (list.length === 0) {
      return (
         <>
            <h3 className="ml-[10px] text-lg text-gray-600">{name}</h3>
            <div className="h-[160px] w-[275px] overflow-y-scroll">
               <p className="ml-[10px]">No element found</p>
            </div>
         </>
      );
   }

   return (
      <>
         <div className="flex">
            <h3 className="ml-[10px] text-lg text-gray-600">{name}</h3>
            <p
               className="text-red-500 ml-auto mr-[50px] mt-[3px]"
               style={{
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
               }}
            >
               {errorMessage()}
            </p>
         </div>
         <div className="h-[160px] w-[275px] overflow-y-scroll">
            <RadioGroup
               className="ml-[20px] flex-column"
               aria-labelledby="template-radio"
            >
               {list.map(elem => (
                  <Tooltip key={elem.name} title={getTooltip(elem)}>
                     <FormControlLabel
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
                  </Tooltip>
               ))}
            </RadioGroup>
         </div>
      </>
   );
}

Radios.defaultProps = {
   onChangeElem: () => {},
   checkValidation: undefined,
   errors: undefined,
   useAttackModeTooltips: undefined,
   useTemplateTooltips: undefined,
};
