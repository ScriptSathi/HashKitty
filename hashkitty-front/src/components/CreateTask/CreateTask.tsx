import { CardHeader, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import useOnKeyPress from '../../hooks/useOnKeyPress';
import useIsMobile from '../../hooks/useIsMobile';
import FrameCreateTask from './FrameCreateTask';

type CreateTaskProps = {
   closeTaskCreation: () => void;
};

export default function CreateTask({ closeTaskCreation }: CreateTaskProps) {
   useOnKeyPress('Escape', closeTaskCreation);
   const isMobile = useIsMobile({});

   return (
      <FrameCreateTask isMobile={isMobile}>
         <div className="flex justify-between w-full items-center mt-5">
            <CardHeader
               component="h3"
               disableTypography
               title="Create a new task"
               sx={{ fontSize: 25, paddingY: 0 }}
            />
            <div className="pr-20">
               <div
                  role="button"
                  tabIndex={0}
                  onClick={() => closeTaskCreation()}
                  onKeyDown={e => e.key === 'Escape' && closeTaskCreation()}
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
         <CardContent
            sx={{
               height: '100%',
               width: '100%',
            }}
            style={{ marginLeft: 0 }}
         >
            <p>feaafaefaafafaf</p>
         </CardContent>
      </FrameCreateTask>
   );
}
