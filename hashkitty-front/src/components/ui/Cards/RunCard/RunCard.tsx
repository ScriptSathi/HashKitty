import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress, IconButton, SvgIcon, Tooltip } from '@mui/material';

import { TTask } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import useStartTask from '../../../../hooks/useStartTask';
import ApiEndpoints from '../../../../ApiEndpoints';
import useFetchStatus from '../../../../hooks/useFetchStatus';
import { ReactComponent as StartSVG } from '../../../../assets/images/playTask.svg';
import { ReactComponent as StopSVG } from '../../../../assets/images/stopTask.svg';

import './RunCard.scss';
import useStopTask from '../../../../hooks/useStopTask';
import useScreenSize from '../../../../hooks/useScreenSize';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import DeleteButton from '../../Buttons/DeleteButton';
import CardContentBuilder from '../../../../utils/CardContentBuilder';

type CommonCard = {
   task: TTask;
   isRunning: boolean;
   handleRefresh: () => void;
};

export default function RunCard({
   task,
   handleRefresh,
   isRunning: initIsRunning,
}: CommonCard) {
   const { isTablette, isMobile } = useScreenSize({});
   const [isLoading, setIsLoading] = useState(false);
   const { fetchStatus, exitInfo, process, status } = useFetchStatus({
      url: ApiEndpoints.GET.taskStatus,
   });
   const {
      startTask,
      hasStarted,
      error: startError,
   } = useStartTask({
      url: ApiEndpoints.POST.startTask,
      data: task,
   });
   const { stopTask, stoppedSucced } = useStopTask({
      url: ApiEndpoints.GET.stopTask,
   });
   const { deleteTask, isError } = useDeleteTask({
      url: ApiEndpoints.DELETE.task,
      data: task,
   });

   const [isRunning, setIsRunning] = useState(
      initIsRunning || hasStarted || process.isRunning,
   );

   const hasErrors = startError.length > 0 || exitInfo.isError;
   const contentRaws = new CardContentBuilder(task.options);

   if (isRunning || process.isPending) {
      setTimeout(() => {
         fetchStatus();
         if (process.isRunning) {
            setIsLoading(false);
         }
         setIsRunning(process.isRunning || process.isPending);
      }, 500);
   } else if (isLoading && (stoppedSucced || hasErrors)) {
      setIsLoading(false);
   }

   const PlayableSvg = isRunning ? StopSVG : StartSVG;
   const iconBtn = isLoading
      ? {}
      : {
           '&:hover': { borderColor: '#FC6F6F' },
           border: 'solid 3px black',
           position: 'static',
        };
   const DisplaySVG = isLoading ? (
      <CircularProgress size={40} thickness={3} color="secondary" />
   ) : (
      <SvgIcon
         sx={{ height: 30, width: 30 }}
         viewBox="9 9 40 40"
         fontSize="inherit"
      >
         <PlayableSvg />
      </SvgIcon>
   );

   function handleStart() {
      startTask();
      setIsRunning(true);
      setIsLoading(true);
   }

   function handleStop() {
      stopTask();
      setIsLoading(true);
      setIsRunning(false);
   }

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
         additionnalBtn={
            <DeleteButton
               tooltip={`Delete the task ${task.name}`}
               isLoading={false}
               handleDeletion={handleDeletion}
            />
         }
      >
         <div className="flex flex-col justify-between min-h-full h-full">
            {!(isTablette || isMobile) && (
               <div className="bloc max-h-[85px] overflow-auto">
                  {contentRaws.shortRaws.map(line => (
                     <Typography
                        key={line}
                        variant="body2"
                        color="text.secondary"
                     >
                        {line}
                     </Typography>
                  ))}
               </div>
            )}
            <div className="flex justify-between">
               <div>
                  <p className="">Speed: {status.speed}</p>
                  <p className="">Progress: {status.runningProgress}</p>
                  <p className="">Time left: {status.estimatedStop}</p>
               </div>
               <div className="flex items-end">
                  <Tooltip title={`${isRunning ? 'Stop' : 'Start'} the task`}>
                     <IconButton
                        disabled={isLoading}
                        onClick={isRunning ? handleStop : handleStart}
                        onKeyDown={e =>
                           e.key === 'Enter' && isRunning
                              ? handleStop()
                              : handleStart()
                        }
                        sx={iconBtn}
                        size="small"
                        aria-label="Start/Stop the task"
                     >
                        {DisplaySVG}
                     </IconButton>
                  </Tooltip>
               </div>
            </div>
         </div>
      </BaseCard>
   );
}
