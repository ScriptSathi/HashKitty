import { CardContent } from '@mui/material';
import FrameHoverCard from '../ui/Cards/FrameHoveCard/FrameHoverCard';

type CreateTaskProps = {
   closeTaskCreation: () => void;
};

export default function CreateTask({ closeTaskCreation }: CreateTaskProps) {
   return (
      <FrameHoverCard title="Create a new task" closeFrame={closeTaskCreation}>
         <CardContent
            sx={{
               height: '100%',
               width: '100%',
            }}
            style={{ marginLeft: 0 }}
         >
            <p>feaafaefaafafaf</p>
         </CardContent>
      </FrameHoverCard>
   );
}
