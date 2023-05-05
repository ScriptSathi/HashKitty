import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { CircularProgress, SvgIcon } from '@mui/material';

import type { TTask } from '../../../../types/TypesORM';
import type { THashcatStatus } from '../../../../types/TApi';
import BaseCard from '../BaseCard/BaseCard';
import useStartTask from '../../../../hooks/useStartTask';
import ApiEndpoints from '../../../../ApiEndpoints';
import useFetchStatus, { TFetchStatus } from '../../../../hooks/useFetchStatus';
import { ReactComponent as StartSVG } from '../../../../assets/images/playTask.svg';
import { ReactComponent as StopSVG } from '../../../../assets/images/stopTask.svg';
import useStopTask from '../../../../hooks/useStopTask';
import useScreenSize from '../../../../hooks/useScreenSize';
import useDeleteTask from '../../../../hooks/useDeleteTask';
import DeleteButton from '../../Buttons/DeleteButton';
import CardContentBuilder from '../../../../utils/CardContentBuilder';
import RunButton from './RunButton';

import './RunCard.scss';

type CommonCard = {
   task: TTask;
   isRunning: boolean;
   handleRefresh: () => void;
};

function RunCard({
   task,
   handleRefresh,
   isRunning: initIsRunning,
}: CommonCard) {
   const { isDesktop } = useScreenSize();
   const [taskStatus, setTaskStatus] = useState<TFetchStatus>({
      data: {} as THashcatStatus,
      loading: true,
      error: null,
      exitInfo: {
         message: '',
         isError: false,
      },
      process: {
         isRunning: false,
         isPending: false,
         isStopped: true,
      },
   });
   const { fetchStatus, status } = useFetchStatus({
      url: ApiEndpoints.GET.taskStatus,
   });
   const { startTask, hasStarted } = useStartTask({
      url: ApiEndpoints.POST.startTask,
      data: task,
   });
   const { stopTask } = useStopTask({
      url: ApiEndpoints.GET.stopTask,
   });
   const { deleteTask, isError } = useDeleteTask({
      url: ApiEndpoints.DELETE.task,
      data: task,
   });

   const [isRunning, setIsRunning] = useState(initIsRunning || hasStarted);
   const [isPending, setIsPending] = useState(taskStatus.process.isPending);

   const contentRaws = new CardContentBuilder(
      task.options,
      task.hashlistId.name,
   );

   useEffect(() => {
      let intervalProcessId: number | undefined;
      if (isRunning) {
         setIsPending(false);
         intervalProcessId = setInterval(() => {
            (async () => {
               const statusState = await fetchStatus();
               if (statusState.process.isStopped) {
                  setIsRunning(false);
                  handleRefresh();
                  clearInterval(intervalProcessId);
               }
               setTaskStatus(statusState);
            })();
         }, 500);
      }
      return () => clearInterval(intervalProcessId);
   }, [isRunning]);

   const PlayableSvg = isRunning ? StopSVG : StartSVG;
   const iconBtn =
      taskStatus.process.isPending || isPending
         ? {}
         : {
              '&:hover': { borderColor: '#FC6F6F' },
              border: 'solid 3px black',
              position: 'static',
           };
   const DisplaySVG =
      taskStatus.process.isPending || isPending ? (
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

   async function handleStart() {
      const startSucced = await startTask();
      if (startSucced) {
         setIsPending(true);
         setIsRunning(true);
      }
   }

   function handleStop() {
      stopTask();
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
            {isDesktop && (
               <div className="bloc max-h-[85px] w-full overflow-auto">
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
                  <RunButton
                     isLoading={taskStatus.process.isPending}
                     isRunning={isRunning}
                     handleStart={() => handleStart()}
                     handleStop={() => handleStop()}
                     sx={iconBtn}
                  >
                     {DisplaySVG}
                  </RunButton>
               </div>
            </div>
         </div>
      </BaseCard>
   );
}

export default RunCard;
