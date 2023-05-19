import { useContext, useEffect, useState } from 'react';
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
import CardContentBuilder from '../../../../utils/CardContentBuilder';
import ColorModeContext from '../../../../App/ColorModeContext';

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
   const { isMobile, isTablette, isDesktop } = useScreenSize();
   const {
      theme: { colors },
   } = useContext(ColorModeContext);
   const [results, setResults] = clickedResults;
   const [endedSince, setEndedSince] = useState('0 minutes');

   const { deleteTask, isError, isLoading } = useDeleteTask({
      url: ApiEndpoints.DELETE.task,
      data: task,
   });

   const contentRaws = new CardContentBuilder(
      task.options,
      task.hashlistId.name,
   );

   useEffect(() => {
      function endedSinceStr() {
         return duration(
            Date.parse(task.endeddAt || '') - Date.now().valueOf(),
            {
               largest: 1,
               maxDecimalPoints: 0,
            },
         );
      }
      setEndedSince(endedSinceStr());
      const intervalId = setInterval(() => {
         setEndedSince(endedSinceStr());
      }, 10000);
      return () => clearInterval(intervalId);
   }, []);

   const handleDeletion = () => {
      deleteTask().then(() => {
         if (!isError) {
            // wait the the server to process the deletion before refresh
            setTimeout(() => handleRefresh(), 500);
         }
      });
   };

   return (
      <BaseCard
         title={task.name}
         autoResize
         tooltip={
            <>
               {contentRaws.fullRaws.map(row => (
                  <p key={row}>{row}</p>
               ))}
            </>
         }
      >
         <div className="flex flex-col justify-between min-h-full h-full">
            <div
               className={`flex ${
                  isMobile || isTablette ? 'justify-around' : 'justify-between'
               }`}
            >
               {isDesktop && (
                  <div className="bloc max-h-[100px] w-full overflow-auto">
                     {contentRaws.shortRaws.map(line => (
                        <Typography
                           key={line}
                           variant="body2"
                           sx={{
                              color: colors.fontAlternative,
                           }}
                        >
                           {line}
                        </Typography>
                     ))}
                  </div>
               )}
               <div className={!isMobile && !isTablette ? 'mt-[35px]' : ''}>
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
                        sx={{
                           color: colors.opposite,
                           '&:hover, &.Mui-focusVisible': {
                              backgroundColor: colors.intermediate2,
                              color: colors.intermediate1,
                           },
                        }}
                     >
                        <SummarizeIcon />
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
               {isDesktop && (
                  <div className="flex items-end">
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
