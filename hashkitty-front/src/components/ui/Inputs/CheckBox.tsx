import { useContext } from 'react';
import { UseFormRegister, FieldPath } from 'react-hook-form';
import ColorModeContext from '../../../App/ColorModeContext';

type CheckBoxProps<T extends object> = {
   title: string;
   name?: FieldPath<T> | undefined;
   className?: string;
   checked?: boolean | undefined;
   onClick?: (args: { target: { checked: boolean } }) => void | undefined;
   register?: UseFormRegister<T>;
};
export default function CheckBox<T extends object>({
   className,
   title,
   checked,
   onClick,
   register,
   name,
}: CheckBoxProps<T>) {
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   return (
      <div className={`flex items-center select-none ${className}`}>
         <input
            className="flex fontMedium checkBox mt-1 mr-5"
            type="checkbox"
            checked={checked}
            style={{
               borderColor: colors.font,
               backgroundColor: colors.secondary,
            }}
            {...((register && register(name || ('' as FieldPath<T>))) || {})}
            onClick={
               onClick as React.MouseEventHandler<HTMLInputElement> | undefined
            }
            onChange={() => {}}
         />
         <p className="m-0">{title}</p>
      </div>
   );
}

CheckBox.defaultProps = {
   checked: undefined,
   onClick: undefined,
   className: '',
   name: '',
   register: () => {},
};
