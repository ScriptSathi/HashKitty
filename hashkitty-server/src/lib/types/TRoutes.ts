import { Request, Response } from 'express';
import { THashcatStatus } from './THashcat';
import { ApiOptionsFormData, TDaoById, TDaoCreate } from './TDAOs';
import { TemplateTask } from '../ORM/entity/TemplateTask';
import { Task } from '../ORM/entity/Task';
import { Hashlist } from '../ORM/entity/Hashlist';
import { Notification } from '../ORM/entity/Notification';
import { AttackMode } from '../ORM/entity/AttackMode';
import { HashType } from '../ORM/entity/HashType';
import { ListItem } from './TApi';

export type ReceivedRequest<Body extends { [key: string]: unknown } = {}> =
   Request<{
      body: Body;
   }>;

export type ResponseSend = Response<ResponseAttr>;

export type ResponseAttr = {
   message: string;
   success: boolean;
   httpCode: number;
   status?: Partial<THashcatStatus>;
   passwds?: string[];
   items?: ListItem[];
   fail?: string;
   error?: string;
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
