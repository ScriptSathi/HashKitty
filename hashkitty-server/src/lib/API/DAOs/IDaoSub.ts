export interface IDaoSub<Entity> {
   getAll(): Promise<Entity[]>;
   create(reqBody: Entity): Promise<Entity>;
   deleteById?(id: number): void;
   getById?(id: number): Promise<Entity>;
   update?(reqBody: Entity): Promise<Entity>;
}
