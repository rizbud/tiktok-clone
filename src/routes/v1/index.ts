import express from "express";
import responseJson from "../../helpers/response-json";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import contentRoutes from "./content.routes";

const router = express.Router();

router.get("/", (req, res) => {
  responseJson(res, 200, {
    message: "Hello World!",
  });
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/content", contentRoutes);

export default router;
