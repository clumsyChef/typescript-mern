import express from "express";
import type { Response, Request, NextFunction, Router } from "express";

export const rootRouter: Router = express.Router();

rootRouter.get("^/$|index(.html)?", (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.user) {
        return res.json({ message: "Yaaaaaay Data" });
    }

    return next();
});
