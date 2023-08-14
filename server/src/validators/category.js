import { body } from "express-validator";

// Category vlaidator

export const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is required.")
    .isLength({ min: 3 })
    .withMessage("Category Name should be at least 3 characters"),
];
// Updated Category vlaidator
export const validateUpdatedCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Updated Category Name is required.")
    .isLength({ min: 3 })
    .withMessage("Updated Category Name should be at least 3 characters"),
];
