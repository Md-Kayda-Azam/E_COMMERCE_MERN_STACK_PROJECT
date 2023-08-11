import createError from "http-errors";
import mongoose from "mongoose";

export const findWithId = async (Model, id, options) => {
  try {
    const item = await Model.findById(id, options);

    if (!item)
      throw createError(404, `${Model.modelName} does not axist with this id`);
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid User Id");
    }
    throw error;
  }
};
