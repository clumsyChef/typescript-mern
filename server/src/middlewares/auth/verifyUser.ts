import jwt, { verify } from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import { UserModels } from "../../models";

dotenv.config();

const verifyToken = (token: string, secret: string) => {
    let decoded;
    try {
        decoded = jwt.verify(token, secret);
    } catch (error: any) {
        decoded = error.message;
    }

    const message: any = {
        expired: typeof decoded === "string" && decoded.includes("jwt expired"),
        noJwt: typeof decoded === "string" && decoded === "jwt must be provided",
    };

    if (!message.expired && !message.noJwt) {
        message.value = decoded;
    }

    return message;
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    let { accessToken, refreshToken } = req.cookies;
    const [accessSecret, refreshSecret] = [
        process.env.ACCESS_TOKEN_SECRET as string,
        process.env.REFRESH_TOKEN_SECRET as string,
    ];

    if (accessToken && refreshToken) {
        const verifiedAccess = verifyToken(accessToken, accessSecret);
        if (verifiedAccess.value) {
            // @ts-ignore
            req.user = verifiedAccess.value;
        } else {
            const verifiedRefresh = verifyToken(refreshToken, refreshSecret);
            const userData = await UserModels.getAll({ refreshToken });
            if (verifiedRefresh.value && userData?.length) {
                const tokenData = { id: userData[0].id, email: userData[0].email };
                const newAccessToken = jwt.sign(tokenData, accessSecret, {
                    expiresIn: "10s",
                });
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    maxAge: 10 * 1000,
                });
                console.log("New Access Token Generated");
                // @ts-ignore
                req.user = tokenData;
            } else if (verifiedRefresh.expired && userData?.length) {
                const newData = { ...userData[0], refreshToken: null };
                const data = await UserModels.update(newData);
            }
        }
    }

    return next();
};
