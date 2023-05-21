import { EventEmitter } from 'events';
import { logger } from './Logger';
import { DaoNotification } from '../API/DAOs/DaoNotification';
import { Notification } from '../ORM/entity/Notification';
import { NotificationType } from '../types/TDAOs';
import { StreamEvent } from '../types/TApi';

export class Events extends EventEmitter {
   public streamEvents: StreamEvent[];
   private notif: DaoNotification;

   constructor(notif: DaoNotification) {
      super();
      this.notif = notif;
      this.streamEvents = [];
      this.addListeners();
   }

   public sendNotification: (
      event: NotificationType,
      ...args: string[]
   ) => boolean = (event, ...args) => {
      return this.emit(event, ...args);
   };

   public eventSourceFormatResponse(data: Notification[]) {
      return `data: ${JSON.stringify(data)}\n\n`;
   }

   private addListeners() {
      this.on('success', this.onSuccess);
      this.on('info', this.onInfo);
      this.on('warning', this.onWarning);
      this.on('error', this.onError);
      this.on('debug', this.onDebug);
   }

   private onError = async (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      logger.error(message);
      const notif = await this.createNotification('error', message);
      this.sendNotificationStream(notif);
   };

   private onWarning = async (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      logger.warn(message);
      const notif = await this.createNotification('warning', message);
      this.sendNotificationStream(notif);
   };

   private onInfo = async (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      logger.info(message);
      const notif = await this.createNotification('info', message);
      this.sendNotificationStream(notif);
   };

   private onSuccess = async (message: string, ...debugMessages: string[]) => {
      this.logDebug(...debugMessages);
      logger.info(message);
      const notif = await this.createNotification('success', message);
      this.sendNotificationStream(notif);
   };

   private onDebug(...debugMessages: string[]) {
      this.logDebug(...debugMessages);
   }

   private logDebug(...debugMessages: string[]) {
      for (const message of debugMessages) {
         logger.debug(message);
      }
   }

   private createNotification(
      status: NotificationType,
      message: string
   ): Promise<Notification> {
      const notif = new Notification();
      notif.status = status;
      notif.message = message;
      return this.notif.create(notif);
   }

   private sendNotificationStream(notification: Notification) {
      this.streamEvents.map(stream =>
         stream.res.write(this.eventSourceFormatResponse([notification]))
      );
   }
}
