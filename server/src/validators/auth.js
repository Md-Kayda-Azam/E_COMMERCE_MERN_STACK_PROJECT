import { body } from "express-validator";

// registration vlaidator

export const validateUserRegostration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your full name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at least 3-31 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email adress.")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password.")
    .isLength({ min: 6 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "password should contain  at least one uppercase letter, one lowercase letter, one number, one special characters"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Enter your address.")
    .isLength({ min: 3 })
    .withMessage("Address should be at least 6  characters"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required. Enter you phone number."),
  body("image").optional().isString(),
];

// sign in validator
