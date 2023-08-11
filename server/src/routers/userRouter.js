import express from "express";
import {
  getUsers,
  getUserById,
  deleteUserById,
  proseccRegister,
  activateUserAccount,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadFile.js";
import { validateUserRegostration } from "../validators/auth.js";
import { runValidation } from "../validators/index.js";

// router init
const router = express.Router();

// user all route
router.post(
  "/process-register",
  upload.single("image"),
  validateUserRegostration,
  runValidation,
  proseccRegister
);
router.post("/verify", activateUserAccount);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);

// export default router
export default router;
