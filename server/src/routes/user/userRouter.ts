import express from "express";
import type { Response, Request, NextFunction } from "express";

export const userRouter = express.Router();

userRouter
    .route("/")
    .get((req: Request, res: Response, next: NextFunction) => {
        const { uid } = req.body;
        res.json({ message: `Get user with the id ${uid}` });
    })
    .post(async (req: Request, res: Response, next: NextFunction) => {
        res.json({ message: `Create new user` });
    })
    .put((req: Request, res: Response, next: NextFunction) => {
        const { uid } = req.body;
        res.json({ message: `Change data for the user with id ${uid}` });
    })
    .delete((req: Request, res: Response, next: NextFunction) => {
        const { uid } = req.body;
        res.json({ message: `Delete user with the id ${uid}` });
    });

userRouter
    .route("/all")
    .get((req: Request, res: Response, next: NextFunction) => {
        res.json({ message: "Get all users" });
    });
