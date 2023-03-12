import { Card, CardActions } from '@mui/material';
import { ReactNode } from 'react';

type FrameCreateTaskProps = { isMobile: boolean; children: ReactNode };

export default function FrameCreateTask({
   isMobile,
   children,
}: FrameCreateTaskProps) {
   if (isMobile) {
      return (
         <CardActions
            style={{
               display: 'flex',
               justifyContent: 'start',
               alignItems: 'flex-start',
               flexDirection: 'column',
            }}
            className="h-full w-full"
         >
            {children}
         </CardActions>
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
            paddingX: 2,
         }}
      >
         <CardActions
            style={{
               display: 'flex',
               justifyContent: 'start',
               alignItems: 'flex-start',
               flexDirection: 'column',
            }}
            className="h-full w-full"
         >
            {children}
         </CardActions>
      </Card>
   );
}
