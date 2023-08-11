import express from "express";
import colors from "colors";
import morgan from "morgan";
import bodyParser from "body-parser";
import createHttpError from "http-errors";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import userRouter from "./routers/userRouter.js";
import seedRouter from "./routers/seedRouter.js";
import { errorRespone } from "./helper/respone.js";

//server init
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minutes)
  message: "Too many request for this IP. Please try again later.",
});

// server middleware
app.use(limiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// server route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/seed", seedRouter);

// Cleint Error Handling
app.use((req, res, next) => {
  next(createHttpError(404, "route not found"));
});

// Server Error Handling --> all the errors
app.use((err, req, res, next) => {
  return errorRespone(res, { statusCode: err.status, message: err.message });
});

export default app;
