import { body, check } from "express-validator";
import {
  findAccountByEmail,
  findAccountByUsername,
} from "../services/user.service";

export const registerValidator = [
  body("username")
    .isLength({ min: 6, max: 64 })
    .withMessage("Username is required")
    .trim(),
  check("username").custom(async (value) => {
    const userExist = await findAccountByUsername(value);
    if (userExist) throw new Error("Username already exists");
  }),
  body("fullName")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full Name is required"),
  body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),
  check("email").custom(async (value) => {
    const userExist = await findAccountByEmail(value);
    if (userExist) throw new Error("Email already exists");
  }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),
  body("confirmPassword").custom((value, { req }) => {
    if (value?.trim() !== req.body.password?.trim()) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

export const loginValidator = [
  body("username")
    .isLength({ min: 6, max: 64 })
    .withMessage("Username is required")
    .trim(),
  check("username").custom(async (value) => {
    const userExist = await findAccountByUsername(value);
    if (!userExist) throw new Error("Username does not exist");
  }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),
];

export const refreshTokenValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];
