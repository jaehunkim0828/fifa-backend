import SQ from "sequelize";

import { config } from "../config/config";

const { host, username, database, password } = config.db;

export const sequelize = new SQ.Sequelize(database, username, password, {
  host,
  dialect: "mysql",
  logging: false,
});
