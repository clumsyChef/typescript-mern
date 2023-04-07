import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (email && password) {
        const userData = await UserModels.getAll({ email });
        if (userData?.length) {
            const match = await bcrypt.compare(password, userData[0].password);
            if (match) {
                const [accessSecret, refreshSecret] = [
                    process.env.ACCESS_TOKEN_SECRET,
                    process.env.REFRESH_TOKEN_SECRET,
                ];
                if (accessSecret && refreshSecret) {
                    const accessToken = jwt.sign({ id: userData[0].id, email }, accessSecret, { expiresIn: "10s" });
                    const refreshToken = jwt.sign({ id: userData[0].id, email }, refreshSecret, { expiresIn: "1d" });
                    const dataWithToken = { ...userData[0], refreshToken };
                    const changedData = await UserModels.update(dataWithToken);
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: true,
                        maxAge: 10 * 1000,
                    });
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.status(200).json({ status: true, message: `You are now logged in as ${email}` });
                } else {
                    res.status(401).json({ status: false, message: "Something went wrong." });
                }
            } else {
                res.status(403).json({ status: false, message: "Invalid credentials." });
            }
        } else {
            res.status(401).json({
                status: false,
                message: "No such user exists.",
            });
        }
    } else {
        res.status(401).json({
            status: false,
            message: "Both Email and Password are required.",
        });
    }
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //
};

export const AuthController = { login, logout };
