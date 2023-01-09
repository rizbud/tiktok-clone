import express from "express";
import responseJson from "../../helpers/response-json";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import contentRoutes from "./content.routes";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", (req, res) => {
  responseJson(res, 200, {
    message: "Hello World!",
  });
});

router.use("/auth", authRoutes);
router.use("/profile", isAuthenticated, profileRoutes);
router.use("/content", contentRoutes);

export default router;
