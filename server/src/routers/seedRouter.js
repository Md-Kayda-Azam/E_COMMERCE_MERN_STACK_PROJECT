import express from "express";
import {
  seedGetAllUsers,
  seedGetAllProducts,
} from "../controllers/seedController.js";
import { upload } from "../middleware/uploadFile.js";

// seed router init
const seedRouter = express.Router();

seedRouter.get("/users", upload.single("image"), seedGetAllUsers);
seedRouter.get("/products", upload.single("image"), seedGetAllProducts);

export default seedRouter;
