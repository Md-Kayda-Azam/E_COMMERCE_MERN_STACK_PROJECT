import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
    }),
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
  ],
});
