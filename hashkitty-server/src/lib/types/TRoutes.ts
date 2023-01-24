import { Request, Response } from 'express';
import { THashcatStatus } from './THashcat';

export type ReceivedRequest<Body extends { [key: string]: unknown } = {}> =
    Request<{
        body: Body;
    }>;

export type ResponseSend = Response<ResponseAttr>;

export type ResponseAttr = {
    success?: unknown;
    status?: Partial<THashcatStatus>;
    passwds?: string[];
    fail?: string;
    error?: string | unknown;
};

export type ReqID = { id: string };
export type ReqFileResults = { filename: string };
