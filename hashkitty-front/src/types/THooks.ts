export type TuseRouteError = {
   data: string;
   error: Error;
   internal: boolean;
   status: number;
   statusText: string;
};

export type TuseFetch = {
   method: 'GET' | 'POST' | 'DELETE';
   url: string;
   data?: unknown;
   headers?: { [key: string]: unknown };
   loadOnInit?: boolean;
};
