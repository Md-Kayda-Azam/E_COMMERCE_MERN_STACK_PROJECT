import { validationResult } from "express-validator";
import { errorRespone } from "../helper/respone.js ";

export const runValidators = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errorRespone(res, {
        status: 422,
        message: errors.array()[0].msg,
      });

      return;
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
