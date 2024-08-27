import { DataSource, DataSourceOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { UserEntity } from "../user.entity";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_URI,
    entities: [UserEntity],
    migrations: ['dist/apps/auth/db/migrations/*.js']
}

export const dataSouce = new DataSource(dataSourceOptions);