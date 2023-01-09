import {
  getContents,
  getContent,
  createContent,
  deleteContent,
} from "../../controllers/content.controller";
import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getContents);
router.get("/:id", getContent);
router.post("/", isAuthenticated, createContent);
router.delete("/:id", deleteContent);

export default router;
