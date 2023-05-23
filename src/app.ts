import cors from "cors";
import express from "express";
import { AppDataSource } from "./config/database";
import { router } from "./routes";

export const app = express();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

AppDataSource.initialize()
  .then(async () => {
    console.log("Inicializando o banco de dados.");

    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(router);
  })
  .catch((error) => console.log(error));
