import express from "express";
import { upload } from "../middleware/uploadFile.js";
import {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
} from "../controllers/productController.js";
import { validateProduct } from "../validators/product.js";
import { runValidators } from "../validators/index.js";
import { isAdmin, isLoggedIn } from "../middleware/auth.js";

// router init
const productRouter = express.Router();

// POST --> /api/products --> create product
productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidators,
  isLoggedIn,
  isAdmin,
  handleCreateProduct
);
// GET --> /api/products --> read product
productRouter.get("/", handleGetProducts);
// GET --> /api/product --> Single read product
productRouter.get("/:slug", handleGetProduct);
// DELETE --> /api/product --> delete product
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);
// UPDATE --> /api/product/:slug --> update product
productRouter.put(
  "/:slug",
  upload.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

// export default router
export default productRouter;
