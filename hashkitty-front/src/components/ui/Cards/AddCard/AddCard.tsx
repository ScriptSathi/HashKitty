import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

import { TTask } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';

type CommonCard = {
   task: TTask;
};

export default function AddCard({ task }: CommonCard) {
   const [isMobile, setIsMobile] = useState(true);
   useEffect(() => {
      window.addEventListener('resize', () => {
         if (window.innerWidth <= 960) setIsMobile(true);
         else setIsMobile(false);
      });
   }, []);

   return (
      <BaseCard title={task.name} bigCard={!isMobile}>
         <Typography variant="body2" color="text.secondary">
            Hashlist: {task.hashlistId.name}
         </Typography>
         {task.templateTaskId && (
            <Typography variant="body2" color="text.secondary">
               Template: {task.templateTaskId?.name}
            </Typography>
         )}
      </BaseCard>
   );
}
