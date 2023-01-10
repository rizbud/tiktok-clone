import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import routesV1 from "./routes";
import responseJson from "./helpers/response-json";

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  responseJson(res, 200, {
    message: "Hello World!",
  });
});

app.use("/api", routesV1);

// error 404 handler
app.use((req, res) => {
  responseJson(res, 404, {
    message: "URL Not Found",
  });
});

app.listen(port, () => {
  console.log("Server running on port 3000");
});
