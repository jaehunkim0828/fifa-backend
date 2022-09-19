import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import morganMiddleware from "./morgan-middleware";
import { sequelize } from "./mysql/db";
import rootRouter from "./routes";
import cors from "cors";
import path from "path";
import { config } from "./config/config";

const port = 8080;
const app = express();

app.use(express.json());
app.use(morganMiddleware);
app.use(
  cors({
    origin: [config.http.front],
  })
);
app.set("trust proxy", true);

app.use(express.static(path.join(path.resolve(), "./src/public")));

app.use("/", rootRouter);

//체크 못한 error
app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`running ${port} port.`));
});
