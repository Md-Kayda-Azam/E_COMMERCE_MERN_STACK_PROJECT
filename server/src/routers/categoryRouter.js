import express from "express";
import { runValidators } from "../validators/index.js";
import { isAdmin, isLoggedIn } from "../middleware/auth.js";
import {
  handleCreateCategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} from "../controllers/categoryController.js";
import {
  validateCategory,
  validateUpdatedCategory,
} from "../validators/category.js";

// router init
const categoryRouter = express.Router();

// POST / Create Category
categoryRouter.post(
  "/",
  validateCategory,
  runValidators,
  isLoggedIn,
  isAdmin,
  handleCreateCategory
);

// GET / GET All Categories
categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/:slug", handleGetCategory);
categoryRouter.put(
  "/:slug",
  validateUpdatedCategory,
  runValidators,
  isLoggedIn,
  isAdmin,
  handleUpdateCategory
);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory);
// export default router
export default categoryRouter;
