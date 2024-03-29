import { Card, CardActions, CardHeader } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode, useContext } from 'react';
import useOnKeyPress from '../../../../hooks/useOnKeyPress';
import useScreenSize from '../../../../hooks/useScreenSize';
import ColorModeContext from '../../../../App/ColorModeContext';

type ModalProps = {
   title: string;
   closeFrame: () => void;
   children: ReactNode;
   footer?: ReactNode | undefined;
   className?: string;
   width?: number;
   height?: number;
};

export default function Modal({
   title,
   closeFrame,
   children,
   footer,
   className,
   width,
   height,
}: ModalProps) {
   useOnKeyPress('Escape', closeFrame);
   const { isMobile, isTablette } = useScreenSize();
   const {
      theme: { colors },
   } = useContext(ColorModeContext);

   if (isMobile || isTablette) {
      return (
         <>
            <div
               className={`relative box-border m-5 ${className}`}
               style={{ backgroundColor: colors.main, color: colors.font }}
            >
               <div className="flex justify-between w-full items-center mt-5">
                  <CardHeader
                     component="h3"
                     disableTypography
                     title={title}
                     sx={{
                        fontSize: 25,
                        paddingY: 0,
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'flex-start',
                     }}
                  />
                  <div className="pr-5">
                     <div
                        role="button"
                        tabIndex={0}
                        onClick={() => closeFrame()}
                        onKeyDown={e => e.key === 'Escape' && closeFrame()}
                     >
                        <CloseIcon
                           sx={{
                              height: 40,
                              width: 40,
                           }}
                        />
                     </div>
                  </div>
               </div>
               <CardActions sx={{ display: 'block' }}>{children}</CardActions>
            </div>
            {footer && (
               <div className="fixed bottom-[0px] left-[0px] box-border w-[100vw] p-5">
                  {footer}
               </div>
            )}
         </>
      );
   }

   return (
      <Card
         sx={{
            width,
            height,
            borderRadius: '2rem',
            border: '4px solid',
            maxWidth: 800,
            maxHeight: 600,
            margin: 1,
            paddingX: 2.5,
            cursor: 'default',
            backgroundColor: colors.main,
            color: colors.font,
         }}
      >
         <div className="relative m-5 h-full">
            <div className="flex justify-between items-center">
               <CardHeader
                  component="h3"
                  disableTypography
                  title={title}
                  sx={{
                     fontSize: 25,
                     paddingY: 0,
                     display: 'flex',
                     justifyContent: 'start',
                     alignItems: 'flex-start',
                  }}
               />
               <div className="pr-5">
                  <div
                     role="button"
                     tabIndex={0}
                     onClick={() => closeFrame()}
                     onKeyDown={e => e.key === 'Escape' && closeFrame()}
                  >
                     <CloseIcon
                        sx={{
                           height: 40,
                           width: 40,
                        }}
                     />
                  </div>
               </div>
            </div>
            <CardActions sx={{ display: 'block', marginTop: 2 }}>
               {children}
            </CardActions>
            {footer && (
               <div className="absolute bottom-[40px] w-full">{footer}</div>
            )}
         </div>
      </Card>
   );
}

Modal.defaultProps = {
   className: '',
   footer: undefined,
   width: 800,
   height: 600,
};
