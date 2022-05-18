import express, { Request, Response, NextFunction, ErrorRequestHandler} from "express";
import { sequelize } from "./db";

import rootRouter from "./routes";

const port = 8080;
const app = express();

app.use('/', rootRouter);


//체크 못한 error
app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.sendStatus(500);
})

sequelize.sync().then(() => {
    app.listen(port, () => console.log(`running ${port} port.`));
})