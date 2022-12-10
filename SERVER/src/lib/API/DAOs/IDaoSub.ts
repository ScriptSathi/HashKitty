import { TDaoCreate } from '../../types/TDAOs';

export interface IDaoSub<T, Y extends TDaoCreate> {
    getAll(): Promise<T[]>;
    create(reqBody: Y): Promise<T>;
    deleteById(id: number): void;
    getById(id: number): Promise<T>;
    update(reqBody: Partial<T>): Promise<void>;
}
