import { FormControlLabel, Radio, Typography } from '@mui/material';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { useState } from 'react';
import InfoTooltip from '../Tooltips/InfoTooltip';
import { RadioOnChangeEvent, StandardList } from '../../../types/TComponents';
import { TTemplate } from '../../../types/TypesORM';

type RadioItemProps<
   T extends StandardList | TTemplate,
   Form extends FieldValues,
> = {
   register: UseFormRegister<Form>;
   fieldName: Path<Form>;
   elem: T;
   tooltipText: string | JSX.Element;
   showTooltips?: boolean;
   className?: string;
   checkValidation?: (elem: T) => boolean | undefined;
   onChangeElem?: (props: {
      event: RadioOnChangeEvent<number>;
      elem: T;
   }) => void;
};

function RadioItem<
   T extends StandardList | TTemplate,
   Form extends FieldValues,
>({
   elem,
   className,
   register,
   checkValidation,
   onChangeElem = () => {},
   showTooltips,
   tooltipText,
   fieldName,
}: RadioItemProps<T, Form>) {
   const [isHover, setIsHover] = useState(false);
   const displayTooltip = isHover && showTooltips;
   return (
      <div
         className={className}
         onMouseEnter={() => setIsHover(true)}
         onMouseLeave={() => setIsHover(false)}
      >
         <FormControlLabel
            sx={{ height: 25 }}
            value={elem.id}
            control={
               <Radio
                  checked={checkValidation ? checkValidation(elem) : undefined}
                  color="secondary"
               />
            }
            label={<Typography sx={{ fontSize: 14 }}>{elem.name}</Typography>}
            {...register(fieldName)}
            onChange={event =>
               onChangeElem({
                  event: event as RadioOnChangeEvent<number>,
                  elem,
               })
            }
         />
         {displayTooltip && (
            <InfoTooltip
               className={isHover ? 'visible' : 'hidden'}
               tooltip={tooltipText}
            />
         )}
      </div>
   );
}

RadioItem.defaultProps = {
   onChangeElem: () => {},
   checkValidation: undefined,
   showTooltips: undefined,
   className: '',
};

export default RadioItem;
