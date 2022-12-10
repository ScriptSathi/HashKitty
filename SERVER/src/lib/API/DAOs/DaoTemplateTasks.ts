import { DataSource } from 'typeorm';

export class DaoTemplateTasks {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }
}
