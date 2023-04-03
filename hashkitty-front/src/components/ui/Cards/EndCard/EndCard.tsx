import Typography from '@mui/material/Typography';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { IconButton, Tooltip } from '@mui/material';
import duration from 'humanize-duration';
import { TTask } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import ApiEndpoints from '../../../../ApiEndpoints';
import useScreenSize from '../../../../hooks/useScreenSize';
import DeleteButton from '../../Buttons/DeleteButton';

type CommonCard = {
   task: TTask;
   handleRefresh: () => void;
   clickedResults: [
      {
         isClicked: boolean;
         listName: string;
         listId: number;
      },
      React.Dispatch<
         React.SetStateAction<{
            isClicked: boolean;
            listName: string;
            listId: number;
         }>
      >,
   ];
};

export default function EndCard({
   task,
   handleRefresh,
   clickedResults,
}: CommonCard) {
   const { isMobile, isTablette } = useScreenSize({});
   const [results, setResults] = clickedResults;

   const { deleteTask, isError, isLoading } = useDeleteTask({
      url: ApiEndpoints.DELETE.task,
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

   const handleDeletion = () => {
      deleteTask().then(() => {
         if (!isError) {
            // wait the the server to process the deletion before refresh
            setTimeout(() => handleRefresh(), 500);
         }
      });
   };

   return (
      <BaseCard title={task.name} autoResize>
         <div className="flex flex-col justify-between min-h-full h-full">
            <div
               className={`flex ${
                  isMobile || isTablette ? 'justify-around' : 'justify-between'
               }`}
            >
               {!(isMobile || isTablette) && (
                  <div>
                     <Typography
                        component="p"
                        variant="body2"
                        color="text.secondary"
                     >
                        Hash type: {task.hashlistId.hashTypeId.name}
                     </Typography>
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
               <div className="flex items-center">
                  <Tooltip title="Show the cracked passwords">
                     <IconButton
                        disabled={isLoading}
                        onClick={() =>
                           !results.isClicked &&
                           setResults({
                              isClicked: true,
                              listId: task.hashlistId.id,
                              listName: task.hashlistId.name,
                           })
                        }
                        onKeyDown={e =>
                           e.key === 'Enter' &&
                           !results.isClicked &&
                           setResults({
                              isClicked: true,
                              listId: task.hashlistId.id,
                              listName: task.hashlistId.name,
                           })
                        }
                     >
                        <SummarizeIcon className="IconBtn__icon" />
                     </IconButton>
                  </Tooltip>
               </div>
               {(isMobile || isTablette) && (
                  <DeleteButton
                     tooltip={`Delete the task ${task.name}`}
                     isLoading={isLoading}
                     handleDeletion={handleDeletion}
                  />
               )}
            </div>
            <div
               className={`flex justify-between ${
                  isMobile || isTablette ? 'text-[1.5vh]' : 'text-base'
               }`}
            >
               <div>
                  <p className="">Ended Since: {endedSince}</p>
                  <p className="">
                     Cracked passwords:{' '}
                     {task.hashlistId.numberOfCrackedPasswords}
                  </p>
               </div>
               {!(isMobile || isTablette) && (
                  <div className="flex items-center">
                     <DeleteButton
                        tooltip={`Delete the task ${task.name}`}
                        isLoading={isLoading}
                        handleDeletion={handleDeletion}
                     />
                  </div>
               )}
            </div>
         </div>
      </BaseCard>
   );
}
