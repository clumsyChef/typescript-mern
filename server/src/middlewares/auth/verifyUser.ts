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
            if (verifiedRefresh.value) {
            } else if (verifiedRefresh.expired) {
                const userData = await UserModels.getAll({ refreshToken });
                if (userData?.length) {
                    const newData = { ...userData[0] };
                } else {
                    //
                }
            }
        }
    } else {
        return next();
    }

    // if (!refreshToken) return next();

    // const verifiedRefresh = verifyToken(refreshToken, refreshSecret);
    // if (verifiedRefresh.noJwt || verifiedRefresh.expired) return next();
    // const matchUser = await UserModels.getAll({ refreshToken: verifiedRefresh.value });
    // if (!matchUser?.[0]) {
    //     const findUserWithEmail = await UserModels.getAll({ email: verifiedRefresh.value.email });
    //     if (findUserWithEmail?.[0]) {
    //         const newData = { ...findUserWithEmail[0], refreshToken: null };
    //         const savedData = await UserModels.update(newData);
    //     }
    //     return next();
    // }

    // if (!accessToken) {
    //     const { email, id } = matchUser[0];
    //     accessToken = jwt.sign({ email, id }, accessSecret, {
    //         expiresIn: "10s",
    //     });

    //     res.cookie("accessToken", accessToken, {
    //         maxAge: 10 * 1000,
    //         httpOnly: true,
    //     });
    // }

    // const verifiedAccess = verifyToken(accessToken, accessSecret);
    // if (verifiedAccess.noJwt || verifiedAccess.expired) return next();

    //else {
    // const { email, id } = matchUser[0];
    // const newAccessToken = jwt.sign({ email, id }, accessSecret, {
    //     expiresIn: "10s",
    // });

    // res.cookie("accessToken", newAccessToken, {
    //     maxAge: 10 * 1000,
    //     httpOnly: true,
    // });
    // console.log("NEW ACCESS TOKEN GENERATED");
    //}
};
