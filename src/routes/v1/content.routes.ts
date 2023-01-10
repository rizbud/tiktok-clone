import express from "express";

import {
  getContents,
  getContent,
  createContent,
  deleteContent,
} from "../../controllers/content.controller";
import {
  getComments,
  createComment,
  deleteComment,
} from "../../controllers/comment.controller";

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

// comment
router.get("/:contentId/comments", getComments);
router.post("/:contentId/comments", isAuthenticated, createComment);
router.delete(
  "/:contentId/comments/:commentId",
  isAuthenticated,
  deleteComment
);

export default router;
