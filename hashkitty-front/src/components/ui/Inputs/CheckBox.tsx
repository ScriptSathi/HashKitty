import { UseFormRegister, FieldPath } from 'react-hook-form';

type CheckBoxProps<T extends object> = {
   title: string;
   name?: FieldPath<T> | undefined;
   className?: string;
   checked?: boolean | undefined;
   onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
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
   return (
      <div className={`flex items-center select-none ${className}`}>
         <input
            className="flex fontMedium checkBox mt-1 mr-5"
            type="checkbox"
            checked={checked}
            {...((register && register(name || ('' as FieldPath<T>))) || {})}
            onClick={onClick}
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
