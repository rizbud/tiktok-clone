import { getProfile } from "../../controllers/profile.controller";
import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", isAuthenticated, getProfile);

export default router;
