import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
} from "../controllers/authController.js";
import { isLoggedIn, isLoggedOut } from "../middleware/auth.js";
import { validateUserLogin } from "../validators/auth.js";
import { runValidators } from "../validators/index.js";

// router init
const authRouter = express.Router();

// auth route
authRouter.post(
  "/login",
  validateUserLogin,
  runValidators,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtectedRoute);

// export default router
export default authRouter;
