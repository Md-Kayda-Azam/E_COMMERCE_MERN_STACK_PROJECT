import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { logger } from "./controllers/loggerController.js";
import { server_port } from "./scret.js";

app.listen(server_port, async () => {
  logger.log(
    "info",
    "Server is running at http://localhost:3001".bgGreen.black
  );
  await connectDatabase();
});
