import express from "express";
import { getProfile } from "../../controllers/profile.controller";
import { getUser } from "../../controllers/user.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", isAuthenticated, getProfile);
router.get("/:id", getUser);

export default router;
