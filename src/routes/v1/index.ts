import express from "express";
import responseJson from "../../helpers/response-json";
import authRoutes from "./auth.routes";

const router = express.Router();

router.get("/", (req, res) => {
  responseJson(res, 200, {
    message: "Hello World!",
  });
});

router.use("/auth", authRoutes);

export default router;
