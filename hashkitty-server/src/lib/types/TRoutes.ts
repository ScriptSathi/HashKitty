import { Request, Response } from 'express';
import { THashcatStatus } from './THashcat';
import { ApiOptionsFormData, TDaoById, TDaoCreate } from './TDAOs';

export type ReceivedRequest<Body extends { [key: string]: unknown } = {}> =
    Request<{
        body: Body;
    }>;

export type ResponseSend = Response<ResponseAttr>;

export type ResponseAttr = {
    message: string;
    success?: unknown;
    status?: Partial<THashcatStatus>;
    passwds?: string[];
    fail?: string;
    error?: string | unknown;
};

// ------------------------------ //
// Bellow is types for all routes //
// ------------------------------ //

export type UploadFile = {
    fileName: string;
};
export type ReqID = { id: string };
export type ReqFileResults = { filename: string };

export type AddHashlist = UploadFile & { hashTypeId: number };

export type TaskUpdate = TDaoCreate &
    Partial<TDaoById> & {
        hashlistId: number;
        options: ApiOptionsFormData;
        templateTaskId?: number;
    };

export type TemplateTaskUpdate = TDaoCreate &
    Partial<TDaoById> & {
        options: ApiOptionsFormData;
    };
