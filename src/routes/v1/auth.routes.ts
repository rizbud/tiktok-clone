import { register, login } from "../../controllers/auth.controller";
import express from "express";
import {
  registerValidator,
  loginValidator,
} from "../../validators/auth.validator";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

export default router;
