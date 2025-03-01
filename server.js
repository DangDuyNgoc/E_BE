import express from "express";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "./config/data.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import commentRoute from "./routes/uploadRouter.js";
import bannerRoute from "./routes/bannerRoute.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const app = express();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Api Working");
});

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/comments", commentRoute);
app.use("/api/banner", bannerRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server Started on ${process.env.DEV_MODE} mode on port ${port}`.bgCyan
      .white
  );
});
