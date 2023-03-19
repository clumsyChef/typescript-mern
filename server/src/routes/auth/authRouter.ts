import express from "express";
import { AuthController } from "../../controllers";

export const authRouter = express.Router();

authRouter.route("/login").post(AuthController.login);

authRouter.route("/logout").post(AuthController.logout);
