import createError from "http-errors";
import { emailWithNodeMailer } from "./email.js";

export const sendEmail = async (emailData) => {
  try {
    await emailWithNodeMailer(emailData);
  } catch (error) {
    next(createError("Faild to send verification email"));
    return;
  }
};
