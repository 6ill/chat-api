import { UserEntity } from "@app/common";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.POSTGRES_URI,
    entities: [UserEntity],
    migrations: ['dist/apps/auth/apps/auth/src/db/migrations/*.js']
}

export const dataSouce = new DataSource(dataSourceOptions);