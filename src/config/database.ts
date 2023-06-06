import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from ".";
import { CompanyModel } from "../entity/Company";
import { LogTransactionModel } from "../entity/LogTransaction";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.DB_HOST,
  port: 3306,
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  charset: config.DB_CHARSET,
  synchronize: true,
  entities: [CompanyModel, LogTransactionModel],
});
