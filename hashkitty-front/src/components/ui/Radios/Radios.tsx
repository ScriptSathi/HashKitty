import { RadioGroup } from '@mui/material';
import {
   FieldErrors,
   FieldValues,
   Path,
   UseFormRegister,
} from 'react-hook-form';
import { useContext } from 'react';
import { RadioOnChangeEvent, StandardList } from '../../../types/TComponents';
import tooltips from '../../../tooltips';
import { TTemplate } from '../../../types/TypesORM';
import RadioItem from './RadioItem';
import CardContentBuilder from '../../../utils/CardContentBuilder';
import ColorModeContext from '../../../App/ColorModeContext';

type RadiosProps<T extends StandardList, Form extends FieldValues> = {
   list: T[];
   register: UseFormRegister<Form>;
   name: string;
   fieldName: Path<Form>;
   errors?: FieldErrors<Form> | undefined;
   useTemplateTooltips?: boolean | undefined;
   useAttackModeTooltips?: boolean | undefined;
   checkValidation?: (elem: T) => boolean | undefined;
   onChangeElem?: (props: {
      event: RadioOnChangeEvent<number>;
      elem: T;
   }) => void;
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
   checkValidation,
   onChangeElem,
}: RadiosProps<T, Form>) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
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
         const contentRaws = new CardContentBuilder(
            (item as TTemplate).options,
         );
         return (
            <>
               {contentRaws.fullRaws.map(row => (
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
            <h3
               className="ml-[10px] text-lg"
               style={{ color: colors.fontAlternative }}
            >
               {name}
            </h3>
            <div className="h-[160px] w-[275px] overflow-y-scroll">
               <p className="ml-[10px]">No element found</p>
            </div>
         </>
      );
   }

   return (
      <>
         <div className="flex">
            <h3
               className="ml-[10px] text-lg"
               style={{ color: colors.fontAlternative }}
            >
               {name}
            </h3>
            <p
               className="ml-auto mr-[50px] mt-[3px]"
               style={{
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
               }}
            >
               {errorMessage()}
            </p>
         </div>
         <div className="h-[170px] w-[275px] overflow-y-scroll">
            <RadioGroup
               className="ml-[20px] flex-column"
               aria-labelledby="template-radio"
            >
               {list.map(elem => (
                  <RadioItem<T, Form>
                     key={elem.id}
                     showTooltips={useAttackModeTooltips || useTemplateTooltips}
                     elem={elem}
                     register={register}
                     tooltipText={getTooltip(elem)}
                     fieldName={fieldName}
                     onChangeElem={onChangeElem}
                     checkValidation={checkValidation}
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
   onChangeElem: () => {},
   checkValidation: undefined,
};
