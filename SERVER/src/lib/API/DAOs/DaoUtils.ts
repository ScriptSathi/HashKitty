import { DataSource } from 'typeorm';
import { Task } from '../../ORM/entity/Task';

export class DaoUtils {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    public async getTasks(): Promise<Task[]> {
        return await this.db.getRepository(Task).find({
            relations: {
                options: true,
            },
        });
    }
}
