if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const config = {
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PASS: process.env.DB_PASS || "root",
  DB_USER: process.env.DB_USER || "root",
  DB_NAME: process.env.DB_NAME || "drclick-checkout",
  DB_CHARSET: process.env.DB_CHARSET || "utf8",
};
