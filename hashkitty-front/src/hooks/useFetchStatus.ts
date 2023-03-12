import { useState } from 'react';
import duration from 'humanize-duration';
import { TuseFetch } from '../types/THooks';

import { THashcatRunningStatus, THashcatStatus } from '../types/TApi';

type Tstate = {
   data: THashcatStatus;
   loading: boolean;
   error: unknown;
   exitInfo: {
      message: string;
      isError: boolean;
   };
};

type Tstatus = {
   estimatedStop: string;
   runningProgress: string;
   speed: string;
};

type ReturnUseFetchStatus = {
   sessionName: string;
   data: THashcatStatus;
   status: Tstatus;
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
   fetchStatus: () => void;
};

const hell = 'aaa';

function filterateStatusData(
   status: THashcatRunningStatus,
): Omit<Tstatus, 'isRunning'> {
   function getFirstDigitsOfNumber(number: number): number {
      return parseInt(number.toString().split('.')[0], number);
   }
   const runningProgress = `${
      (status.progress[0] / status.progress[1]) * 100
   }%`;
   const timeLeft = status.estimated_stop * 1000 - Date.now().valueOf();
   const estimatedStop =
      timeLeft > 0
         ? duration(status.estimated_stop * 1000 - Date.now().valueOf(), {
              largest: 2,
              maxDecimalPoints: 0,
              units: ['y', 'mo', 'w', 'd', 'h', 'm'],
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
   const [state, setState] = useState<Tstate>({
      data: <THashcatStatus>{},
      loading: true,
      error: null,
      exitInfo: {
         message: '',
         isError: false,
      },
   });
   const [status, setStatus] = useState<Tstatus>({
      estimatedStop: 'Not running',
      runningProgress: '0',
      speed: '0',
   });
   const [process, setProcess] = useState({
      isRunning: false,
      isPending: false,
      isStopped: true,
   });

   const defaultHeaders = { 'Content-Type': 'application/json' };
   const reqOptions: RequestInit = {
      method: 'GET',
      headers: { ...defaultHeaders, ...headers },
   };
   function fetchStatus() {
      fetch(url, reqOptions)
         .then(res => res.json())
         .then(
            res => {
               setState({
                  data: res.status.runningStatus,
                  loading: false,
                  error: null,
                  exitInfo: res.status.exitInfo || '',
               });
               if (Object.keys(res.status.runningStatus).length > 0)
                  setStatus(filterateStatusData(res.status.runningStatus));
               if (res.status.processState === 'stopped') {
                  setProcess({
                     isRunning: false,
                     isPending: false,
                     isStopped: true,
                  });
               } else if (res.status.processState === 'pending') {
                  setProcess({
                     isRunning: false,
                     isPending: true,
                     isStopped: false,
                  });
               } else if (res.status.processState === 'running') {
                  setProcess({
                     isRunning: true,
                     isPending: false,
                     isStopped: false,
                  });
               }
            },
            err => {
               setState({
                  data: <THashcatStatus>{},
                  loading: false,
                  error: err,
                  exitInfo: {
                     message: err,
                     isError: true,
                  },
               });
               setProcess({
                  isRunning: false,
                  isPending: false,
                  isStopped: true,
               });
            },
         );
   }
   return {
      fetchStatus,
      sessionName: state.data?.runningStatus?.session || '',
      status,
      data: state.data,
      error: state.error,
      loading: state.loading,
      exitInfo: state.exitInfo,
      process,
   };
}
