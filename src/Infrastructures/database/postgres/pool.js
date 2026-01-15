/* istanbul ignore file */
import pkg from "pg";
const { Pool } = pkg;
import config from "../../../Commons/config.js";

const testConfig =
  process.env.NODE_ENV === "test"
    ? { ...config.database, ssl: false }
    : config.database;

const pool = new Pool(testConfig);

export default pool;
