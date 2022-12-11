import { TDaoCreate } from '../../types/TDAOs';

export interface IDaoSub<Entity, CreateData extends TDaoCreate> {
    getAll(): Promise<Entity[]>;
    create(reqBody: CreateData): Promise<Entity>;
    deleteById(id: number): void;
    getById(id: number): Promise<Entity>;
    update(reqBody: Partial<Entity>): Promise<void>;
}
