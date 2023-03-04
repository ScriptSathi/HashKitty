import { ChangeEvent, Component, FormEvent } from 'react';

import BackgroundBlur from '../ui/BackgroundBlur/BackGroundBlur';
import './ImportList.scss';
import { Utils } from '../../Utils';
import { newListFormData } from '../../types/TComponents';
import { ErrorHandlingCreateList } from '../../ErrorHandlingCreateList';
import { GenericForm } from '../../types/TForm';
import { newListInputsError } from '../../types/TErrorHandling';
import { InputName } from '../Inputs/Inputs';
import { TDBData } from '../../types/TypesORM';
import { Constants } from '../../Constants';
import DragNDrop from '../ui/DragNDrop/DragNDrop';
import Button from '../ui/Button/Button';

type ImportListProps = {
   isToggled: boolean;
   type: keyof Omit<
      TDBData,
      'hashtypes' | 'hashlist' | 'templateTasks' | 'attackModes'
   >;
   toggleFn: () => void;
   handleImportHasSucced: (message: string, isError: boolean) => void;
};

type ImportListState = {} & newListFormData & GenericForm<newListInputsError>;

const defaultFormData = {
   formName: '',
   formList: undefined,
};

export default class ImportList extends Component<
   ImportListProps,
   ImportListState
> {
   private inputsError: ErrorHandlingCreateList;

   constructor(props: ImportListProps) {
      super(props);
      this.inputsError = new ErrorHandlingCreateList();
      this.state = {
         inputsErrorCheck: this.inputsError.results,
         formHasErrors: false,
         ...defaultFormData,
      };
   }

   public render() {
      return (
         <BackgroundBlur
            isToggled={this.props.isToggled}
            toggleFn={this.props.toggleFn}
            centerContent
         >
            <div className="ImportList__cardBody">
               <form
                  onSubmit={e => {
                     this.handleSubmit(e);
                  }}
                  className="ImportList__formBody"
               >
                  <p className="title">Import a {this.props.type}</p>
                  <div className="grid2Fr">
                     <div>
                        <InputName
                           state={this.state}
                           handleInputChange={this.handleInputChange}
                        />
                     </div>
                     <div className="marginLeft30 marginMinus5Up">
                        <p
                           className={
                              this.state.formHasErrors &&
                              this.state.inputsErrorCheck.formList.isError
                                 ? 'isError labelsTitles noMargin'
                                 : 'hideBlock noMargin'
                           }
                        >
                           {this.state.inputsErrorCheck.formList.message}
                        </p>
                        <DragNDrop setFile={this.setFile} />
                     </div>
                  </div>
                  <div className="ImportList__button">
                     <Button type="submit" className="ImportList__submit">
                        Import list
                     </Button>
                  </div>
               </form>
            </div>
         </BackgroundBlur>
      );
   }

   private get form(): FormData {
      const form = new FormData();
      if (this.state.formList) {
         form.append('fileName', this.state.formName);
         form.append('file', this.state.formList);
         form.append('type', this.props.type);
      }
      return form;
   }

   private setFile = (formList: File): void => {
      this.setState({ formList });
   };

   private handleInputChange = (
      event:
         | ChangeEvent<HTMLInputElement>
         | (React.MouseEvent<HTMLInputElement, MouseEvent> &
              ChangeEvent<HTMLInputElement>),
   ) => {
      if (event.target.name !== '' && event.target.name in this.state) {
         const { target } = event;
         const value = Utils.santizeInput(event);
         this.setState({
            [target.name]: value,
         } as unknown as newListFormData);
      }
   };

   private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      this.inputsError.analyse({
         formName: this.state.formName,
         formList: this.state.formList || undefined,
      });
      this.setState({
         inputsErrorCheck: this.inputsError.results,
         formHasErrors: this.inputsError.hasErrors,
      });
      if (!this.inputsError.hasErrors) {
         if (this.state.formList) {
            this.submitForm();
         } else {
            // TODO No reference found
         }
      }
   };

   private submitForm(): void {
      const requestOptions = {
         method: 'POST',
         body: this.form,
         ...Constants.mandatoryFetchOptions,
      };
      fetch(Constants.apiPOSTAddList, requestOptions)
         .then(response => {
            return response.json();
         })
         .then(res => {
            let isError = true;
            if (res.success) isError = false;
            this.props.handleImportHasSucced(res.message, isError);
            this.props.toggleFn();
         });
   }
}
