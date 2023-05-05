import { useState } from 'react';
import duration from 'humanize-duration';
import { TuseFetch } from '../types/THooks';

import {
   ResponseStatus,
   THashcatRunningStatus,
   THashcatStatus,
} from '../types/TApi';

export type TFetchStatus = {
   data: THashcatStatus;
   loading: boolean;
   error: unknown;
   exitInfo: {
      message: string;
      isError: boolean;
   };
   process: {
      isRunning: boolean;
      isPending: boolean;
      isStopped: boolean;
   };
};

type Tstatus = {
   estimatedStop: string;
   runningProgress: string;
   speed: string;
};

type ReturnUseFetchStatus = {
   status: Tstatus;
   fetchStatus: () => Promise<TFetchStatus>;
};

function filterateStatusData(
   status: THashcatRunningStatus,
): Omit<Tstatus, 'isRunning'> {
   function getFirstDigitsOfNumber(number: number): number {
      return Math.trunc(number);
   }
   function getRunningProgess([nbOfWordsTested, totalWordsToTest]: [
      number,
      number,
   ]): number {
      return Math.trunc((nbOfWordsTested / totalWordsToTest) * 100);
   }
   const runningProgress = `${getRunningProgess(status.progress)}%`;
   const estimatedStop =
      status.estimated_stop > 0
         ? duration(status.estimated_stop, {
              largest: 2,
              maxDecimalPoints: 0,
              //   units: ['y', 'mo', 'w', 'd', 'h', 'm'],
           })
         : '0 minutes';
   const unFormatedSpeed = status.devices[0].speed;
   let speed = '';
   if (unFormatedSpeed > 10 ** 12) {
      const tmp = unFormatedSpeed / 10 ** 12;
      speed = `${getFirstDigitsOfNumber(tmp)} TH/S`;
   } else if (unFormatedSpeed > 10 ** 9) {
      const tmp = unFormatedSpeed / 10 ** 9;
      speed = `${getFirstDigitsOfNumber(tmp)} GH/S`;
   } else if (unFormatedSpeed > 10 ** 6) {
      const tmp = unFormatedSpeed / 10 ** 6;
      speed = `${getFirstDigitsOfNumber(tmp)} MH/S`;
   } else if (unFormatedSpeed > 10 ** 3) {
      const tmp = unFormatedSpeed / 10 ** 3;
      speed = `${getFirstDigitsOfNumber(tmp)} KH/S`;
   } else {
      speed = `${unFormatedSpeed} H/S`;
   }
   return {
      estimatedStop,
      runningProgress,
      speed,
   };
}

export default function useFetchStatus({
   url,
   headers = {},
}: Omit<TuseFetch, 'method' | 'data'>): ReturnUseFetchStatus {
   const defaultState: TFetchStatus = {
      data: <THashcatStatus>{},
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
   };
   const [status, setStatus] = useState<Tstatus>({
      estimatedStop: 'Not running',
      runningProgress: '0',
      speed: '0',
   });

   const defaultHeaders = { 'Content-Type': 'application/json' };
   const reqOptions: RequestInit = {
      method: 'GET',
      headers: { ...defaultHeaders, ...headers },
   };
   const fetchStatus = async () => {
      try {
         const jsonRes = await fetch(url, reqOptions);
         const res: ResponseStatus = await jsonRes.json();
         const fetchState = {
            data: res.status,
            loading: false,
            error: null,
            exitInfo: res.status.exitInfo,
            process: {
               isRunning: false,
               isPending: false,
               isStopped: true,
            },
         };

         if (Object.keys(res.status.runningStatus).length > 0)
            setStatus(
               filterateStatusData(
                  <THashcatRunningStatus>res.status.runningStatus,
               ),
            );
         if (res.status.processState === 'pending') {
            fetchState.process = {
               isRunning: false,
               isPending: true,
               isStopped: false,
            };
         } else if (res.status.processState === 'running') {
            fetchState.process = {
               isRunning: true,
               isPending: false,
               isStopped: false,
            };
         }
         return fetchState;
      } catch (err) {
         return defaultState;
      }
   };

   return {
      fetchStatus,
      status,
   };
}
