import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { server_port } from "./scret.js";

app.listen(server_port, async () => {
  console.log("Server is running at http://localhost:3001".bgGreen.black);
  await connectDatabase();
});
