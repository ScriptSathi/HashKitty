import { useState } from 'react';

import ApiEndpoints from '../../ApiEndpoints';
import Frame from '../../components/Frame/Frame';
import CreateCard from '../../components/ui/Cards/CreateCard/CreateCard';
import RunCard from '../../components/ui/Cards/RunCard/RunCard';
import EndCard from '../../components/ui/Cards/EndCard/EndCard';
import useFetchList from '../../hooks/useFetchList';
import useFetchStatus from '../../hooks/useFetchStatus';

import { TTask } from '../../types/TypesORM';
import useIsMobile from '../../hooks/useIsMobile';
import BackgroundBlur from '../../components/ui/BackgroundBlur/BackGroundBlur';
import CreateTask from '../../components/CreateTask/CreateTask';

export default function HomePage() {
   const [isClickedCreation, setIsClickedCreation] = useState(false);
   const isMobile = useIsMobile({});
   const { items, isLoading } = useFetchList<TTask>({
      method: 'GET',
      url: ApiEndpoints.apiGetTasks,
   });
   const { sessionName } = useFetchStatus({
      url: ApiEndpoints.apiGetStatus,
   });
   const [tasks, endedTasks] = items.reduce(
      ([_tasks, _endedTasks]: TTask[][], element: TTask) =>
         element.isfinished
            ? [_tasks, [..._endedTasks, ...[element]]]
            : [[..._tasks, ...[element]], _endedTasks],
      [[], []],
   );
   const closeTaskCreation = () => setIsClickedCreation(false);

   if (isMobile && isClickedCreation) {
      return (
         <Frame>
            <CreateTask closeTaskCreation={closeTaskCreation} />
         </Frame>
      );
   }
   return (
      <Frame isLoading={isLoading}>
         <div className="grid grid-cols-2">
            <div>
               <h2 className="flex justify-center text-3xl">Runnable tasks</h2>
               <div className="flex flex-wrap justify-center">
                  <CreateCard
                     clickedCreation={[isClickedCreation, setIsClickedCreation]}
                  />
                  {tasks.map(task => (
                     <RunCard
                        key={task.id}
                        task={tasks[0]}
                        isRunning={sessionName === `${task.name}-${task.id}`}
                     />
                  ))}
               </div>
            </div>
            <div>
               <h2 className="flex justify-center text-3xl">Ended tasks</h2>
               <div className="flex flex-wrap justify-center">
                  {endedTasks.map(task => (
                     <EndCard key={task.id} task={task} />
                  ))}
               </div>
            </div>
         </div>
         {isClickedCreation && (
            <BackgroundBlur toggleFn={closeTaskCreation}>
               <CreateTask closeTaskCreation={closeTaskCreation} />
            </BackgroundBlur>
         )}
      </Frame>
   );
}
