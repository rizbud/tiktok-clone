import express from "express";
import responseJson from "../helpers/response-json";
import apiV1 from "./v1";

const router = express.Router();

router.get("/", (req, res) => {
  responseJson(res, 200, {
    message: "Hello World!",
  });
});

router.use("/v1", apiV1);

export default router;
