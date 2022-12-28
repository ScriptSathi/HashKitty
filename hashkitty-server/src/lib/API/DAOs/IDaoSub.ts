import { TDaoCreate, TDaoCreateAttackMode } from '../../types/TDAOs';

export interface IDaoSub<
    Entity,
    CreateData extends TDaoCreate | TDaoCreateAttackMode
> {
    getAll(): Promise<Entity[]>;
    create(reqBody: CreateData | Entity): Promise<Entity>;
    deleteById(id: number): void;
    getById(id: number): Promise<Entity>;
    update(reqBody: Partial<Entity>): Promise<void>;
}
