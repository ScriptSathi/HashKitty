import { useContext, useState } from 'react';
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
import ColorModeContext from '../../../App/ColorModeContext';

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
   const {
      theme: { isDarkTheme, colors },
   } = useContext(ColorModeContext);

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

   function getBorderTheme() {
      if (file) {
         return isDarkTheme
            ? 'DragNDrop__boxFull DragNDrop__boxFull_darkThemeBorder'
            : 'DragNDrop__boxFull DragNDrop__boxFull_lightThemeBorder';
      }
      return isDarkTheme
         ? 'DragNDrop__boxEmpty DragNDrop__boxEmpty_dark'
         : 'DragNDrop__boxEmpty DragNDrop__boxEmpty_light';
   }

   function logoColor() {
      if (isMouseOver) return 'DragNDrop__onHover';
      if (isDarkTheme) return 'DragNDrop__invertImg';
      return '';
   }

   return (
      <Dropzone onDrop={onDrop}>
         {({ getRootProps, getInputProps }) => (
            <section className="DragNDrop" style={{ width, height }}>
               <div
                  {...getRootProps()}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  className={`w-full h-full flex items-center justify-center ${getBorderTheme()}`}
               >
                  <div className="flex flex-col items-center">
                     <img
                        className={`inline ${logoColor()}`}
                        src={file ? asFileImg : importAFileImg}
                        alt="Import a list"
                     />
                     <p
                        className="DragNDrop__text"
                        style={{
                           color: isMouseOver
                              ? colors.intermediate1
                              : colors.fontAlternative,
                        }}
                     >
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
