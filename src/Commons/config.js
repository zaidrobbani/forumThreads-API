import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: path.resolve(__dirname, "../../.test.env"),
  });
} else {
  dotenv.config();
}

const config = {
  app: {
    host:
      process.env.NODE_ENV !== "production"
        ? "localhost"
        : process.env.APP_HOST,
    port: process.env.PORT,
    debug: process.env.NODE_ENV !== "development" ? { request: ["error"] } : {},
  },
  database: process.env.NODE_ENV !== "production" ? {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  } : {
    connectionString: process.env.DATABASE_URL,
    max: 1,
    ssl: {
      rejectUnauthorized: false,
    },
  },

};

export default config;
