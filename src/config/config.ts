import dotenv from "dotenv";

dotenv.config();

function required(key: string, defaultValue = "") {
  const value: string = process.env[key] || defaultValue;
  if (value == null) throw new Error(`Key ${key} is undefined`);
  return value;
}

export const config = {
  api: {
    fifaKey: required("FIFA_API_KEY"),
  },
  db: {
    host: required("HOST"),
    username: required("USERNAME"),
    database: required("DATABASE"),
    password: required("PASSWORD"),
  },
  http: {
    domain: required("DOMAIN"),
    port: required("PORT"),
    front: required("FRONT_URL"),
  },
  email: {
    user: required("EMAIL_USER"),
    user2: required("EMAIL_USER2"),
    password: required("EMAIL_PASSWORD"),
  },
};
