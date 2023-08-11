import mongoose from "mongoose";
import { mongodb_url } from "../scret.js";
import colors from "colors";

export const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(mongodb_url, options);
    console.log("Cunnection to DB is successfull established".bgMagenta.green);

    mongoose.connection.on("error", (error) => {
      console.error("DB cunnection error", error);
    });
  } catch (error) {
    console.error("Could not cunnect to DB", error.toString());
  }
};
