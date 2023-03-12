import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress, IconButton, SvgIcon } from '@mui/material';

import { TTask } from '../../../../types/TypesORM';
import BaseCard from '../BaseCard/BaseCard';
import useStartTask from '../../../../hooks/useStartTask';
import ApiEndpoints from '../../../../ApiEndpoints';
import useFetchStatus from '../../../../hooks/useFetchStatus';
import { ReactComponent as StartSVG } from '../../../../assets/images/playTask.svg';
import { ReactComponent as StopSVG } from '../../../../assets/images/stopTask.svg';

import './RunCard.scss';
import useStopTask from '../../../../hooks/useStopTask';
import useIsMobile from '../../../../hooks/useIsMobile';

type CommonCard = {
   task: TTask;
   isRunning: boolean;
};

export default function RunCard({
   task,
   isRunning: initIsRunning,
}: CommonCard) {
   const isMobile = useIsMobile({});
   const [isLoading, setIsLoading] = useState(false);
   const { fetchStatus, exitInfo, process, status } = useFetchStatus({
      url: ApiEndpoints.apiGetStatus,
   });
   const {
      startTask,
      hasStarted,
      error: startError,
   } = useStartTask({
      url: ApiEndpoints.apiPOSTStart,
      data: task,
   });
   const { stopTask, stoppedSucced } = useStopTask({
      url: ApiEndpoints.apiGetStop,
   });

   const [isRunning, setIsRunning] = useState(
      initIsRunning || hasStarted || process.isRunning,
   );

   const hasErrors = startError.length > 0 || exitInfo.isError;

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

   const templateTxt = task.templateTaskId ? (
      <Typography variant="body2" color="text.secondary">
         Template: {task.templateTaskId?.name}
      </Typography>
   ) : (
      <p />
   );

   const PlayableSvg = isRunning ? StopSVG : StartSVG;
   const iconBtn = isLoading
      ? {}
      : {
           '&:hover': { borderColor: '#FC6F6F' },
           border: 'solid 3px black',
           position: 'static',
        };
   const DisplaySVG = isLoading ? (
      <CircularProgress size={40} thickness={3} />
   ) : (
      <SvgIcon
         sx={{ height: 30, width: 30 }}
         viewBox="9 9 40 40"
         fontSize="inherit"
      >
         <PlayableSvg />
      </SvgIcon>
   );

   function displayMessage() {
      const message = {
         message: '',
         isError: true,
      };
      if (exitInfo.message.length > 0) {
         message.message = exitInfo.message;
      } else if (startError.length > 0) {
         message.message = startError;
      }
      return message;
   }
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
                  {templateTxt}
               </div>
            )}
            <div className="flex justify-between">
               <div>
                  <p className="">Speed: {status.speed}</p>
                  <p className="">Progress: {status.runningProgress}</p>
                  <p className="">Time left: {status.estimatedStop}</p>
               </div>
               <div className="flex items-center">
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
               </div>
            </div>
         </div>
      </BaseCard>
   );
}
