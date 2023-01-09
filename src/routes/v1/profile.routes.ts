import { getProfile } from "../../controllers/profile.controller";
import express from "express";

const router = express.Router();

router.get("/me", getProfile);

export default router;
