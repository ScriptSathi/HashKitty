import { EventEmitter } from 'events';
import { logger } from './Logger';
import { DaoNotification } from '../API/DAOs/DaoNotification';
import { Notification } from '../ORM/entity/Notification';
import { NotificationType } from '../types/TDAOs';

export class Events extends EventEmitter {
   private notif: DaoNotification;

   constructor(notif: DaoNotification) {
      super();
      this.notif = notif;
      this.addListeners();
   }

   public notify: (event: NotificationType, ...args: string[]) => boolean = (
      event,
      ...args
   ) => {
      return this.emit(event, ...args);
   };

   private addListeners() {
      this.on('success', this.onSuccess);
      this.on('info', this.onInfo);
      this.on('warning', this.onWarning);
      this.on('error', this.onError);
   }

   private onError = (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      this.notif.create(this.createNotification('error', message));
   };

   private onWarning = (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      this.notif.create(this.createNotification('warning', message));
   };

   private onInfo = (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      this.notif.create(this.createNotification('info', message));
   };

   private onSuccess = (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      this.notif.create(this.createNotification('success', message));
   };

   private logDebug(...debugMessages: string[]) {
      for (const message of debugMessages) {
         logger.debug(message);
      }
   }

   private createNotification(
      status: NotificationType,
      message: string
   ): Notification {
      const notif = new Notification();
      notif.status = status;
      notif.message = message;
      return notif;
   }
}