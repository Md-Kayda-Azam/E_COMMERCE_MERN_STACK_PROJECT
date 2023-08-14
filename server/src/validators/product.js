import { body } from "express-validator";

// Product vlaidator

export const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required.")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product Name should be at least 3-150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 3 })
    .withMessage("Description  should be at least 3 characters"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isLength({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category Name is required."),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required.")
    .isLength({ min: 1 })
    .withMessage("Quantity must be a positive number ingeter"),
];
