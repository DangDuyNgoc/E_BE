import express from "express";
import {
  activeUser,
  loginController,
  registrationUser,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/registration", registrationUser);
userRoute.post("/activate-user", activeUser);
userRoute.post("/login", loginController);

export default userRoute;
