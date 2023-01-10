import {
  getContents,
  getContent,
  createContent,
  deleteContent,
} from "../../controllers/content.controller";
import express from "express";
import {
  isAuthenticated,
  optionalAuthenticated,
} from "../../middlewares/auth.middleware";
import { multerMiddleware } from "../../middlewares/multer.middleware";

const router = express.Router();

router.get("/", getContents);
router.get("/:id", optionalAuthenticated, getContent);
router.post("/", isAuthenticated, multerMiddleware, createContent);
router.delete("/:id", isAuthenticated, deleteContent);

export default router;
