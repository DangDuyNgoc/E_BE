import express from "express";
import { isAuthenticated } from "./../middlewares/authMiddleware.js";
import {
  activeUser,
  loginController,
  registrationUser,
  logoutController,
  getUserInfoController,
  updateProfile,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/registration", registrationUser);
userRoute.post("/activate-user", activeUser);
userRoute.post("/login", loginController);
userRoute.post("/logout", logoutController);
userRoute.get("/user-info", isAuthenticated, getUserInfoController);
userRoute.put("/update-profile", isAuthenticated, updateProfile);

export default userRoute;
