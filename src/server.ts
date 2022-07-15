import config from "config";
import express from "express";
import v1Router from "./routes/v1";

const app = express();
const port = config.get("httpPort") || 8001;

app.use("/api/v1", v1Router);

app.listen(port, () => {
  console.log("listening on port", port);
});
