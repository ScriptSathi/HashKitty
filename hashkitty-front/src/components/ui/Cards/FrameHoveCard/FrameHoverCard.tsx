import { Card, CardActions, CardHeader } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';
import useOnKeyPress from '../../../../hooks/useOnKeyPress';
import useIsMobile from '../../../../hooks/useIsMobile';

type FrameHoverCardProps = {
   title: string;
   closeFrame: () => void;
   children: ReactNode;
   footer?: ReactNode | undefined;
   className?: string;
};

export default function FrameHoverCard({
   title,
   closeFrame,
   children,
   footer,
   className,
}: FrameHoverCardProps) {
   useOnKeyPress('Escape', closeFrame);
   const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <>
            <div className={`relative box-border m-5 ${className}`}>
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
               <div className="fixed bottom-[0px] box-border w-full p-5">
                  {footer}
               </div>
            )}
         </>
      );
   }

   return (
      <Card
         sx={{
            width: 800,
            height: 600,
            borderRadius: '2rem',
            border: '4px solid',
            maxWidth: 800,
            maxHeight: 600,
            margin: 1,
            paddingLeft: 1,
            paddingRight: 2.5,
            cursor: 'default',
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

FrameHoverCard.defaultProps = {
   className: '',
   footer: undefined,
};
