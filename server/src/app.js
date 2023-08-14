import express from "express";
import colors from "colors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookie_paser from "cookie-parser";
import createHttpError from "http-errors";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import userRouter from "./routers/userRouter.js";
import seedRouter from "./routers/seedRouter.js";
import { errorRespone } from "./helper/respone.js";
import authRouter from "./routers/authRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import productRouter from "./routers/produtRouter.js";

//server init
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minutes)
  message: "Too many request for this IP. Please try again later.",
});

// server middleware
app.use(cookie_paser());
app.use(limiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// server route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/seed", seedRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);

// Cleint Error Handling
app.use((req, res, next) => {
  next(createHttpError(404, "route not found"));
});

// Server Error Handling --> all the errors
app.use((err, req, res, next) => {
  return errorRespone(res, { statusCode: err.status, message: err.message });
});

export default app;
