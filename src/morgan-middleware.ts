import { Request, Response } from "express";
import morgan from "morgan";
import Logger from "./config/logger";

const stream = {
  // Use the http severity
  write: (message: any) => {
    Logger.http(message);
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "dev";
  return env !== "dev";
};

morgan.token("status", function (req, res) {
  let color;

  if (res.statusCode < 300) color = "\x1B[32m"; //green
  else if (res.statusCode < 400) color = "\x1B[36m"; //cyan
  else if (res.statusCode < 500) color = "\x1B[33m"; //yellow
  else if (res.statusCode < 600) color = "\x1B[31m"; //red
  else color = "[0m"; /*글자색 초기화*/

  return color + res.statusCode /*보라색*/;
});

morgan.token("request", function (req: Request, res: Response) {
  return "Request_" + JSON.stringify(req.body);
});

const morganMiddleware = morgan(
  "요청_:method | url_':url' | :request | Status_:status | 응답시간_:response-time ms (:res[content-length]줄)",
  { stream, skip }
);

export default morganMiddleware;
