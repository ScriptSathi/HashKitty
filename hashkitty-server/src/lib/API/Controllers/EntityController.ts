import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';

export default class EntityController {
   private dao: Dao;
   private notify: Events['notify'];

   constructor(dao: Dao) {
      this.dao = dao;
      this.notify = new Events(this.dao.notification).notify;
   }
}
