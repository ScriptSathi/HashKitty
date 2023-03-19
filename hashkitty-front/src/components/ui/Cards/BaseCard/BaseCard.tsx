import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActions, CardHeader } from '@mui/material';
import useScreenSize from '../../../../hooks/useScreenSize';

type TBaseCard = {
   children: React.ReactNode;
   title: string;
   displayMessage?: {
      message: string;
      isError: boolean;
   };
   bigCard?: boolean;
   autoResize?: boolean | null;
};

export default function BaseCard({
   children,
   bigCard,
   title,
   autoResize,
   displayMessage,
}: TBaseCard) {
   const { isTablette, isMobile } = useScreenSize({});

   const fullSize = {
      width: 400,
      height: 250,
   };
   const smallSize = {
      width: 250,
      height: 150,
   };
   const sizingBehaviour =
      bigCard && autoResize === null
         ? bigCard
         : autoResize && !(isTablette || isMobile);

   const size = sizingBehaviour ? fullSize : smallSize;
   const titleSize = sizingBehaviour ? 'h5' : 'h6';
   const contentStyleOnScreenSize =
      isTablette || isMobile
         ? { fontSize: 15, paddingTop: 0 }
         : { paddingTop: 1 };
   const headerStyleOnScreenSize =
      isTablette || isMobile
         ? { fontSize: 20, paddingTop: 10 }
         : { fontSize: 22 };
   return (
      <Card sx={{ ...size, borderRadius: '1rem', maxWidth: 345, margin: 1 }}>
         <CardActions
            style={{
               display: 'flex',
               justifyContent: 'start',
               alignItems: 'flex-start',
               flexDirection: 'column',
            }}
            className="h-full w-full"
         >
            <div className="flex items-center justify-between">
               <CardHeader
                  style={{
                     paddingBottom: 0,
                     paddingTop: 2,
                     width: '20vh',
                     ...headerStyleOnScreenSize,
                  }}
                  className="break-normal"
                  component={titleSize}
                  disableTypography
                  title={title}
               />
               <p
                  className={`mx-4 ${
                     displayMessage && displayMessage.isError
                        ? 'text-red-500'
                        : 'text-green-500'
                  } ${isTablette || isMobile ? 'text-sm' : 'text-base'}`}
               >
                  {displayMessage?.message}
               </p>
            </div>
            <CardContent
               sx={{
                  height: '100%',
                  width: '100%',
                  ...contentStyleOnScreenSize,
               }}
               style={{ marginLeft: 0 }}
            >
               {children}
            </CardContent>
         </CardActions>
      </Card>
   );
}

BaseCard.defaultProps = {
   bigCard: true,
   autoResize: null,
   displayMessage: {
      message: '',
      isError: false,
   },
};
