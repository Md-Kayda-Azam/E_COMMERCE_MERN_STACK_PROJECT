import mongoose from "mongoose";
import { mongodb_url } from "../scret.js";
import colors from "colors";
import { logger } from "../controllers/loggerController.js";

export const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(mongodb_url, options);
    logger.log(
      "info",
      "Cunnection to DB is successfull established".bgMagenta.green
    );

    mongoose.connection.on("error", (error) => {
      logger.log("error", "DB cunnection error", error);
    });
  } catch (error) {
    logger.log("error", "Could not cunnect to DB", error.toString());
  }
};
