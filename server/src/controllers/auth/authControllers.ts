import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // const { username, password } = req.body;
    // if (username && password) {
    //     const userData = await UserModels.get({ username });
    //     if (userData) {
    //         const comparePass: boolean = await bcrypt.compare(
    //             password,
    //             userData.password
    //         );
    //         if (comparePass) {
    //             res.status(201).json({
    //                 status: true,
    //                 message: `You are logged in as ${username}.`,
    //             });
    //         } else {
    //             res.status(401).json({
    //                 status: false,
    //                 message: "Incorrect credentials.",
    //             });
    //         }
    //     } else {
    //         res.status(401).json({
    //             status: false,
    //             message: `Incorrect credentials.`,
    //         });
    //     }
    // } else {
    //     res.status(401).json({
    //         status: false,
    //         message: "Both Username and Password are required.",
    //     });
    // }
};

const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    //
};

export const AuthController = { login, logout };
