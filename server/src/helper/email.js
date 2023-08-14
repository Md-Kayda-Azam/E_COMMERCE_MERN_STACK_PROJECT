import nodemailer from "nodemailer";
import { smtpUsername, smtpPassword } from "../scret.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use port 465 for SSL
  secure: true,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

export const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOption = {
      from: `"E-commerce 👻" <${smtpUsername}>`,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOption);
    logger.log("info", "Message sent:", info.response);
  } catch (error) {
    logger.log("error", "Error occurred while sending email:", error);
    throw error;
  }
};
