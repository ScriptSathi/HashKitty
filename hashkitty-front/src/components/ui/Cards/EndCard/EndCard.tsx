import Typography from '@mui/material/Typography';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import duration from 'humanize-duration';
import { TTask } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import ApiEndpoints from '../../../../ApiEndpoints';
import useIsMobile from '../../../../hooks/useIsMobile';
import './EndCard.scss';

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
   const isMobile = useIsMobile({});
   const [results, setResults] = clickedResults;

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
         handleRefresh();
      }
   };

   function displayMessage() {
      return {
         message: deleteMessage,
         isError,
      };
   }
   function displayDeleteBtn() {
      return (
         <IconButton
            disabled={isLoading}
            onClick={handleDeletion}
            onKeyDown={e => e.key === 'Delete' && handleDeletion()}
         >
            <DeleteIcon className="EndCard__icon" />
         </IconButton>
      );
   }
   return (
      <BaseCard title={task.name} autoResize displayMessage={displayMessage()}>
         <div className="flex flex-col justify-between min-h-full h-full">
            <div
               className={`flex ${
                  isMobile ? 'justify-around' : 'justify-between'
               }`}
            >
               {!isMobile && (
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
                     <SummarizeIcon className="EndCard__icon" />
                  </IconButton>
               </div>
               {isMobile && displayDeleteBtn()}
            </div>
            <div
               className={`flex justify-between ${
                  isMobile ? 'text-[1.5vh]' : 'text-base'
               }`}
            >
               <div>
                  <p className="">Ended Since: {endedSince}</p>
                  <p className="">
                     Cracked passwords:{' '}
                     {task.hashlistId.numberOfCrackedPasswords}
                  </p>
               </div>
               {!isMobile && (
                  <div className="flex items-center">{displayDeleteBtn()}</div>
               )}
            </div>
         </div>
      </BaseCard>
   );
}
