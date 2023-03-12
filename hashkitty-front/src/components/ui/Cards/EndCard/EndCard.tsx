import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import duration from 'humanize-duration';
import { TTask } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import ApiEndpoints from '../../../../ApiEndpoints';
import useFetchStatus from '../../../../hooks/useFetchStatus';
import useIsMobile from '../../../../hooks/useIsMobile';

type CommonCard = {
   task: TTask;
};

export default function EndCard({ task }: CommonCard) {
   const isMobile = useIsMobile({});
   const { fetchStatus, exitInfo, process, status } = useFetchStatus({
      url: ApiEndpoints.apiGetStatus,
   });
   const { deleteTask, deleteMessage, isError, isLoading } = useDeleteTask({
      url: ApiEndpoints.apiPOSTDeleteTasks,
      data: task,
   });
   const endedSince = duration(
      Date.parse(task.endeddAt || '') - Date.now().valueOf(),
      {
         largest: 1,
         maxDecimalPoints: 0,
         units: ['y', 'mo', 'w', 'd', 'h', 'm'],
      },
   );
   const handleDeletion = async () => {
      await deleteTask();
      if (!isError) {
         // Do refresh tasks
      }
   };

   function displayMessage() {
      return {
         message: deleteMessage,
         isError,
      };
   }

   return (
      <BaseCard title={task.name} autoResize displayMessage={displayMessage()}>
         <div className="flex flex-col justify-between min-h-full h-full">
            {!isMobile && (
               <div>
                  <Typography
                     component="p"
                     variant="body2"
                     color="text.secondary"
                  >
                     Hashlist: {task.hashlistId.name}
                  </Typography>
                  <Typography
                     component="p"
                     variant="body2"
                     color="text.secondary"
                  >
                     Wordlist: {task.options.wordlistId.name}
                  </Typography>
               </div>
            )}
            <div className="flex justify-between">
               <div>
                  <p className="">Ended Since: {endedSince}</p>
                  <p className="">
                     Cracked passwords:{' '}
                     {task.hashlistId.numberOfCrackedPasswords}
                  </p>
               </div>
               <div className="flex items-center">
                  <IconButton
                     disabled={isLoading}
                     onClick={handleDeletion}
                     onKeyDown={e => e.key === 'Delete' && handleDeletion()}
                  >
                     <DeleteIcon />
                  </IconButton>
               </div>
            </div>
         </div>
      </BaseCard>
   );
}
