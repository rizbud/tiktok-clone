import { register } from "../../controllers/auth.controller";
import express from "express";
import { registerValidator } from "../../validators/auth.validator";

const router = express.Router();

router.post("/register", registerValidator, register);

export default router;
