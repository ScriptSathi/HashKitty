import { Component } from 'react';

import './DeleteButton.scss';
import trash from '../../../assets/images/trash.svg';
import { RequestUtils, StandardResponse } from '../../../RequestUtils';

type DeleteButtonState = {};

type DeleteButtonProps = {
   apiEndpoint: string;
   idToDelete: number;
   handleRefreshAfterDelete: () => void;
};

export default class DeleteButton extends Component<
   DeleteButtonProps,
   DeleteButtonState
> {
   public render() {
      return (
         <img
            className="deleteButton"
            onClick={this.deleteOnClick}
            src={trash}
            alt="Logo"
         />
      );
   }

   private deleteOnClick = () => {
      RequestUtils.POST<StandardResponse>(
         this.props.apiEndpoint,
         { id: this.props.idToDelete },
         () => {
            setTimeout(() => this.props.handleRefreshAfterDelete(), 100);
         },
      );
   };
}
