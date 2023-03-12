import { Component } from 'react';
import './BackGroundBlur.scss';

interface BackgroundBlurProps {
   children: React.ReactNode;
   toggleFn: () => void;
}

type BackgroundBlurState = {
   isMouseOver: boolean;
};

export default class BackgroundBlur extends Component<
   BackgroundBlurProps,
   BackgroundBlurState
> {
   public constructor(props: BackgroundBlurProps) {
      super(props);
      this.state = {
         isMouseOver: false,
      };
   }

   private onMouseEnterCantClick: () => void = () => {
      this.setState({
         isMouseOver: true,
      });
   };

   private onMouseLeaveCanClick: () => void = () => {
      this.setState({
         isMouseOver: false,
      });
   };

   public render() {
      const { isMouseOver } = this.state;
      const { toggleFn, children } = this.props;
      const onClick = () => !isMouseOver && toggleFn();
      return (
         <div
            className="backgroundBlur"
            onClick={onClick}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            role="button"
            aria-hidden
         >
            <div
               onMouseEnter={this.onMouseEnterCantClick}
               onMouseLeave={this.onMouseLeaveCanClick}
            >
               {children}
            </div>
         </div>
      );
   }
}
