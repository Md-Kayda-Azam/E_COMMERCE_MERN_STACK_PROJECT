import express from "express";
import { seedGetAllUsers } from "../controllers/seedController.js";

// seed router init
const seedRouter = express.Router();

seedRouter.get("/users", seedGetAllUsers);

export default seedRouter;
