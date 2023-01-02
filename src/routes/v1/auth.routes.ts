import {
  register,
  login,
  refreshToken,
} from "../../controllers/auth.controller";
import express from "express";
import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} from "../../validators/auth.validator";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh-token", refreshTokenValidator, refreshToken);

export default router;
