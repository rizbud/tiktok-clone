import express from "express";
import { getProfile } from "../../controllers/profile.controller";
import { getUser } from "../../controllers/user.controller";
import {
  follow,
  getFollowers,
  getFollowings,
  unfollow,
} from "../../controllers/follow.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", isAuthenticated, getUser);

router.get("/:id", getUser);
router.post("/:id/follow", isAuthenticated, follow);
router.delete("/:id/unfollow", isAuthenticated, unfollow);
router.get("/:id/followers", isAuthenticated, getFollowers);
router.get("/:id/followings", isAuthenticated, getFollowings);

export default router;
