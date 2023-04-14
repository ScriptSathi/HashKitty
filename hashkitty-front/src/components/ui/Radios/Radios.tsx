import { RadioGroup } from '@mui/material';
import {
   FieldErrors,
   FieldValues,
   Path,
   UseFormRegister,
} from 'react-hook-form';
import { StandardList } from '../../../types/TComponents';
import tooltips from '../../../tooltips';
import { TTemplate } from '../../../types/TypesORM';
import RadioItem from './RadioItem';

type RadiosProps<T extends StandardList, Form extends FieldValues> = {
   list: T[];
   register: UseFormRegister<Form>;
   name: string;
   fieldName: Path<Form>;
   errors?: FieldErrors<Form> | undefined;
   useTemplateTooltips?: boolean | undefined;
   useAttackModeTooltips?: boolean | undefined;
};

export default function Radios<
   T extends StandardList | TTemplate,
   Form extends FieldValues,
>({
   list,
   register,
   fieldName,
   name,
   errors,
   useTemplateTooltips,
   useAttackModeTooltips,
}: RadiosProps<T, Form>) {
   const errorMessage = () => {
      if (errors && errors[fieldName]) {
         return errors[fieldName]?.message as string;
      }
      return '';
   };

   const getTooltip = (item: T): string | JSX.Element => {
      if (useAttackModeTooltips) {
         return tooltips.inputs.attackModes[(item as StandardList).mode ?? 0];
      }
      if (useTemplateTooltips) {
         const templateTooltips = tooltips.inputs.templates(item as TTemplate);
         return (
            <>
               {templateTooltips.map(row => (
                  <p key={row}>{row}</p>
               ))}
            </>
         );
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
                  <RadioItem<Form>
                     className="flex justify-between"
                     key={elem.id}
                     showTooltips={useAttackModeTooltips || useTemplateTooltips}
                     elem={elem}
                     register={register}
                     tooltipText={getTooltip(elem)}
                     fieldName={fieldName}
                  />
               ))}
            </RadioGroup>
         </div>
      </>
   );
}

Radios.defaultProps = {
   errors: undefined,
   useAttackModeTooltips: undefined,
   useTemplateTooltips: undefined,
};
