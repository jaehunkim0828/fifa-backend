import { createPool } from 'mysql2';
import SQ from 'sequelize';

import { config } from './config';

const { host, username, database, password } = config.db;

export const sequelize = new SQ.Sequelize(database, username, password, {
    host, dialect: 'mysql'
})

const pool = createPool({
    host,
    user: username,
    database,
    password,
})

export const db = pool.promise();