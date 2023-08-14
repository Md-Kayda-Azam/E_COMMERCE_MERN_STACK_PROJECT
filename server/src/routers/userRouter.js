import express from "express";
import {
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleProseccRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleUpdateForgotPassword,
  handleUpdateResetPassword,
} from "../controllers/userController.js";
import { upload } from "../middleware/uploadFile.js";
import {
  validateForgotPassword,
  validatePasswordUpdate,
  validateResetPassword,
  validateUserRegistration,
} from "../validators/auth.js";
import { runValidators } from "../validators/index.js";
import { isAdmin, isLoggedIn, isLoggedOut } from "../middleware/auth.js";

// router init
const router = express.Router();

// user all route
router.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidators,
  handleProseccRegister
);
router.post("/activate", isLoggedOut, handleActivateUserAccount);
router.get("/", isLoggedIn, isAdmin, handleGetUsers);
router.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetUserById);
router.delete("/:id", isLoggedIn, handleDeleteUserById);
router.put(
  "/reset-password",
  validateResetPassword,
  runValidators,
  handleUpdateResetPassword
);
router.put(
  "/:id([0-9a-fA-F]{24})",
  upload.single("image"),
  isLoggedIn,
  handleUpdateUserById
);
router.put(
  "/ban-user/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  handleBanUserById
);
router.put("/unban-user/:id([0-9a-fA-F]{24})", isLoggedIn, handleUnbanUserById);
router.put(
  "/update-password/:id([0-9a-fA-F]{24})",
  validatePasswordUpdate,
  runValidators,
  isLoggedIn,
  handleUpdatePassword
);
router.post(
  "/forgot-password",
  validateForgotPassword,
  runValidators,
  handleUpdateForgotPassword
);

// export default router
export default router;
