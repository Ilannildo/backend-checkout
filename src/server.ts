import { app } from "./app";

const DEFAULT_PORT = 8000;

app.listen(process.env.PORT || DEFAULT_PORT, () => {
  const server = `${
    (process.env.NODE_ENV === "production" ? "https://" : "http://") +
    process.env.HOST
  }:${process.env.PORT}`;

  // logging initialization
  console.log(process.env.APP_NAME);
  console.log(`Environment:     ${process.env.NODE_ENV}`);
  console.log(`Server:          ${server}`);
  console.log("\n");
});
