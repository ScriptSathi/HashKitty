import { DataSource, Repository } from 'typeorm';
import { IDaoSub } from './IDaoSub';
import { Notification } from '../../ORM/entity/Notification';

export class DaoNotification implements IDaoSub<Notification> {
    private db: Repository<Notification>;

    constructor(db: DataSource) {
        this.db = db.getRepository(Notification);
    }
    public getAll(): Promise<Notification[]> {
        return this.db.find();
    }

    public create(notification: Notification): Promise<Notification> {
        return this.db.save(notification);
    }

    public deleteById(id: number): void {
        this.db.delete(id);
    }
}
