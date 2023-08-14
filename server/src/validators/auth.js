import { body } from "express-validator";

// registration vlaidator

export const validateUserRegistration = [
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
  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("User image is required"),
];
// sign in validator

export const validateUserLogin = [
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
];

// update password
export const validatePasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required. Enter your password.")
    .isLength({ min: 6 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Old Password should contain  at least one uppercase letter, one lowercase letter, one number, one special characters"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your password.")
    .isLength({ min: 6 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "New Password should contain  at least one uppercase letter, one lowercase letter, one number, one special characters"
    ),
  body("confirmedPassword").custom((value, { req }) => {
    if (value != req.body.newPassword) {
      throw Error("Password did not match");
    }
    return true;
  }),
];
// forgot password
export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email adress.")
    .isEmail()
    .withMessage("Invalid email address"),
];
// reset password
export const validateResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is mising."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(" Password is required. Enter your password.")
    .isLength({ min: 6 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      " Password should contain  at least one uppercase letter, one lowercase letter, one number, one special characters"
    ),
];
// reset password
export const validateRefreshToken = [
  body("token").trim().notEmpty().withMessage("Token is mising."),
];
