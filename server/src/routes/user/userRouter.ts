import express from "express";
import type { Response, Request, NextFunction } from "express";
import { UserController } from "../../controllers";

export const userRouter = express.Router();

userRouter
    .route("/")
    .get(UserController.get)
    .post(UserController.create)
    .put(UserController.update)
    .delete(UserController.remove);

userRouter.route("/all").get(UserController.getAll);
