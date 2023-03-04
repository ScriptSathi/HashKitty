import { Component } from 'react';
import Dropzone from 'react-dropzone';

import './DragNDrop.scss';
import asFileImg from '../../../assets/images/DragNDropOk.svg';
import importAFileImg from '../../../assets/images/DragNDropEmpty.svg';

type DropzoneProps = {
   setFile: (file: File) => void;
};
type DropzoneState = {
   file: File | undefined;
   mouseOver: boolean;
};

export default class DragNDrop extends Component<DropzoneProps, DropzoneState> {
   public state: DropzoneState;

   constructor(props: DropzoneProps) {
      super(props);
      this.state = {
         file: undefined,
         mouseOver: false,
      };
   }

   public render() {
      return (
         <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
               <section>
                  <div
                     {...getRootProps()}
                     onMouseEnter={this.onMouseEnter}
                     onMouseLeave={this.onMouseLeave}
                     className={
                        this.state.file
                           ? 'boxFull widthFull'
                           : 'boxEmpty widthFull'
                     }
                     style={{
                        height: 150,
                        width: '100%',
                     }}
                  >
                     <div className="centerDnD">
                        <img
                           className={
                              this.state.mouseOver
                                 ? 'imgSize onHover'
                                 : 'imgSize'
                           }
                           src={this.state.file ? asFileImg : importAFileImg}
                           alt="create a new task"
                        />
                        <p
                           className={
                              this.state.mouseOver ? 'DnDTextHover' : 'DnDText'
                           }
                        >
                           {this.state.file
                              ? this.state.file.name.replace(
                                   /(.{19})..+/,
                                   '$1…',
                                )
                              : 'Drag & Drop'}
                        </p>
                        <input {...getInputProps()} />
                     </div>
                  </div>
               </section>
            )}
         </Dropzone>
      );
   }

   private onDrop = (acceptedFiles: File[]) => {
      this.setFile(acceptedFiles[acceptedFiles.length - 1]);
   };

   private setFile = (file: File) => {
      this.props.setFile(file);
      this.state.file = file;
   };

   private onMouseEnter = () => {
      this.setState({
         mouseOver: true,
      });
   };

   private onMouseLeave = () => {
      this.setState({
         mouseOver: false,
      });
   };
}
