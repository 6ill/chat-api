import { DeepPartial, FindOneOptions, FindManyOptions, Repository, FindOptions, FindOptionsWhere } from "typeorm";
import { HasId } from "./has-id.interface";
import { TypeORMBaseInterface } from "./typeorm-repository.interface";

export abstract class TypeORMAbstractRepository<T extends HasId> implements TypeORMBaseInterface<T> {
    protected constructor(private entity: Repository<T>)  {}

    public create(data: DeepPartial<T>): T {
        return this.entity.create(data);
    }
    public createMany(data: DeepPartial<T>[]): T[] {
        return this.entity.create(data);
    }
    public async save(data: DeepPartial<T>): Promise<T> {
        return await this.entity.save(data);
    }
    public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
        return await this.entity.save(data);
    }
    public async findOneById(id: number): Promise<T> {
        return await this.entity.findOneBy({id} as FindOptionsWhere<T>);
    }
    public async findOneByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
        return await this.entity.findOne(filterCondition);
    }
    public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.entity.find(options);
    }
    public async remove(data: T): Promise<T> {
        return await this.entity.remove(data);
    }
    public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
        return await this.entity.find(relations);
    }
    public async preload(entityLike: DeepPartial<T>): Promise<T> {
        return await this.entity.preload(entityLike);
    }

}
