import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';

import ApiEndpoints from '../../ApiEndpoints';
import Frame from '../../components/Frame/Frame';
import CreateCard from '../../components/ui/Cards/CreateCard/CreateCard';
import RunCard from '../../components/ui/Cards/RunCard/RunCard';
import EndCard from '../../components/ui/Cards/EndCard/EndCard';
import useFetchItems from '../../hooks/useFetchItems';
import useFetchStatus, { TFetchStatus } from '../../hooks/useFetchStatus';
import useScreenSize from '../../hooks/useScreenSize';
import BackgroundBlur from '../../components/ui/BackgroundBlur/BackGroundBlur';
import CreateTask from '../../components/CreateTask/CreateTask';
import ResultsCard from '../../components/TaskResults/TaskResults';
import { TTask } from '../../types/TypesORM';
import { THashcatStatus } from '../../types/TApi';

export default function HomePage() {
   const defaultResults = {
      isClicked: false,
      listName: '',
      listId: -1,
   };
   const [isClickedCreation, setIsClickedCreation] = useState(false);
   const [switchClicked, setSwitchClicked] = useState(false);
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
   const [results, setResults] = useState(defaultResults);
   const { isTablette, isMobile } = useScreenSize();
   const { items, refresh, isLoading } = useFetchItems<TTask>({
      method: 'GET',
      url: ApiEndpoints.GET.tasks,
   });
   const { fetchStatus } = useFetchStatus({
      url: ApiEndpoints.GET.taskStatus,
   });
   const [tasks, endedTasks] = items.reduce(
      ([_tasks, _endedTasks]: TTask[][], element: TTask) =>
         element.isfinished
            ? [_tasks, [..._endedTasks, element]]
            : [[..._tasks, element], _endedTasks],
      [[], []],
   );
   const closeTaskCreation = () => {
      setIsClickedCreation(false);
      // Sleep to wait until the backend proccess the creation
      setTimeout(() => refresh(), 1000);
   };
   const closeResults = () => setResults(defaultResults);

   document.body.style.overflow = isClickedCreation ? 'hidden' : 'visible';

   const runTaskTitle = 'Runnable tasks';
   const endTaskTitle = 'Ended tasks';

   useEffect(() => {
      const fetchRunningTaskName = async () => {
         setTaskStatus(await fetchStatus());
      };
      fetchRunningTaskName();
   }, []);

   if (isLoading) {
      // To prevent loading of RunCard with the default task status values
      return <Frame isLoading />;
   }
   if ((isTablette || isMobile) && (isClickedCreation || results.isClicked)) {
      return (
         <Frame>
            {isClickedCreation && (
               <CreateTask closeTaskCreation={closeTaskCreation} />
            )}
            {results.isClicked && (
               <ResultsCard
                  listName={results.listName}
                  listId={results.listId}
                  closeResults={closeResults}
               />
            )}
         </Frame>
      );
   }
   if (isMobile) {
      return (
         <Frame>
            <div className="mt-5 flex flex-col items-center">
               <h2 className="flex justify-center text-3xl my-[25px]">
                  {switchClicked ? endTaskTitle : runTaskTitle}
               </h2>
               <Switch
                  color="secondary"
                  onClick={() => setSwitchClicked(!switchClicked)}
               />
               <div className="flex flex-wrap justify-center">
                  {switchClicked ? (
                     endedTasks.map(task => (
                        <EndCard
                           clickedResults={[results, setResults]}
                           handleRefresh={refresh}
                           key={task.id}
                           task={task}
                        />
                     ))
                  ) : (
                     <>
                        <CreateCard
                           name="task"
                           clickedCreation={[
                              isClickedCreation,
                              setIsClickedCreation,
                           ]}
                        />
                        {tasks.map(task => (
                           <RunCard
                              key={task.id}
                              task={task}
                              handleRefresh={refresh}
                              isRunning={
                                 taskStatus.data.taskInfos?.name === task.name
                              }
                           />
                        ))}
                     </>
                  )}
               </div>
            </div>
         </Frame>
      );
   }
   return (
      <Frame>
         <div
            className={`grid grid-cols-2 ${
               isClickedCreation ? 'overflow-hidden' : ''
            }`}
         >
            <div>
               <h2 className="flex justify-center text-3xl my-[25px]">
                  {runTaskTitle}
               </h2>
               <div className="flex flex-wrap justify-center">
                  <CreateCard
                     name="task"
                     clickedCreation={[isClickedCreation, setIsClickedCreation]}
                  />
                  {tasks.map(task => (
                     <RunCard
                        key={task.id}
                        handleRefresh={refresh}
                        task={task}
                        isRunning={
                           taskStatus.data.taskInfos?.name === task.name
                        }
                     />
                  ))}
               </div>
            </div>
            <div>
               <h2 className="flex justify-center text-3xl my-[25px]">
                  {endTaskTitle}
               </h2>
               <div className="flex flex-wrap justify-center">
                  {endedTasks.map(task => (
                     <EndCard
                        clickedResults={[results, setResults]}
                        handleRefresh={refresh}
                        key={task.id}
                        task={task}
                     />
                  ))}
               </div>
            </div>
         </div>
         {isClickedCreation && (
            <BackgroundBlur toggleFn={closeTaskCreation}>
               <CreateTask closeTaskCreation={closeTaskCreation} />
            </BackgroundBlur>
         )}
         {results.isClicked && (
            <BackgroundBlur toggleFn={closeResults}>
               <ResultsCard
                  listName={results.listName}
                  listId={results.listId}
                  closeResults={closeResults}
               />
            </BackgroundBlur>
         )}
      </Frame>
   );
}
