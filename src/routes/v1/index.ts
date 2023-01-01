import express from "express";
import responseJson from "../../helpers/response-json";

const router = express.Router();

router.get("/", (req, res) => {
  responseJson(res, 200, {
    message: "Hello World!",
  });
});

export default router;
