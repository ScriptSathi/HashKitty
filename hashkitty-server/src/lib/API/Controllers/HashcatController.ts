import { Hashcat } from '../../hashcat/Hashcat';
import { Events } from '../../utils/Events';
import { Dao } from '../DAOs/Dao';

export default class HashcatController {
   private dao: Dao;
   private notify: Events['notify'];
   private hashcat: Hashcat;

   constructor(dao: Dao) {
      this.dao = dao;
      this.notify = new Events(this.dao.notification).notify;
      this.hashcat = new Hashcat(this.dao, this.notify);
   }
}
