import { CSSProperties, Component, HTMLAttributes } from 'react';
import './Button.scss';

type ButtonProps = {
   children?: React.ReactNode;
   type?: 'button' | 'reset' | 'submit';
   className?: string | undefined;
   name?: string | undefined;
   style?: CSSProperties | undefined;
} & HTMLAttributes<HTMLButtonElement>;

type ButtonState = {};

export default class Button extends Component<ButtonProps, ButtonState> {
   public render() {
      const {
         children,
         type = 'button',
         className = '',
         name,
         style,
         ...otherProps
      } = this.props;
      return (
         <div className={className} style={style}>
            <button {...otherProps} type={type} className="button" name={name}>
               {children || 'button'}
            </button>
         </div>
      );
   }
}
