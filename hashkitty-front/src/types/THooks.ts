export type TuseRouteError = {
   data: string;
   error: Error;
   internal: boolean;
   status: number;
   statusText: string;
};

export type TuseFetch = {
   method: 'GET' | 'POST';
   url: string;
   data?: unknown;
   headers?: { [key: string]: unknown };
};
