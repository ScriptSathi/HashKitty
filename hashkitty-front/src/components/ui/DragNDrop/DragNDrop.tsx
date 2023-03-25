import { useState } from 'react';
import Dropzone from 'react-dropzone';

import './DragNDrop.scss';
import {
   FieldPath,
   UseFormRegister,
   UseFormSetValue,
   PathValue,
} from 'react-hook-form';
import asFileImg from '../../../assets/images/DragNDropOk.svg';
import importAFileImg from '../../../assets/images/DragNDropEmpty.svg';

type DropzoneProps<Form extends object> = {
   register: UseFormRegister<Form>;
   setValue: UseFormSetValue<Form>;
   height?: number;
   width?: number;
};

export default function DragNDrop<Form extends object>({
   height,
   width,
   register,
   setValue,
   ...args
}: DropzoneProps<Form>) {
   const [isMouseOver, setIsMouseOver] = useState(false);
   const [file, setFile] = useState<File | undefined>(undefined);

   const onDrop = (acceptedFiles: File[]) => {
      setFile(acceptedFiles[acceptedFiles.length - 1]);
      setValue(
         'file' as FieldPath<Form>,
         acceptedFiles[acceptedFiles.length - 1] as PathValue<
            Form,
            FieldPath<Form>
         >,
      );
   };

   const onMouseEnter = () => {
      setIsMouseOver(true);
   };

   const onMouseLeave = () => {
      setIsMouseOver(false);
   };

   return (
      <Dropzone onDrop={onDrop}>
         {({ getRootProps, getInputProps }) => (
            <section className="DragNDrop" style={{ width, height }}>
               <div
                  {...getRootProps()}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  className={`w-full h-full flex items-center justify-center ${
                     file ? 'DragNDrop__boxFull' : 'DragNDrop__boxEmpty'
                  }`}
               >
                  <div className="flex flex-col items-center">
                     <img
                        className={`inline ${
                           isMouseOver && 'DragNDrop__onHover'
                        }`}
                        src={file ? asFileImg : importAFileImg}
                        alt="Import a list"
                     />
                     <p className="DragNDrop__text">
                        {file
                           ? file.name.replace(/(.{19})..+/, '$1…')
                           : 'Drag & Drop'}
                     </p>
                     <input
                        {...register('file' as FieldPath<Form>, {
                           required: {
                              value: true,
                              message: 'Required',
                           },
                        })}
                        {...getInputProps()}
                        {...args}
                     />
                  </div>
               </div>
            </section>
         )}
      </Dropzone>
   );
}

DragNDrop.defaultProps = {
   height: 200,
   width: 300,
};
