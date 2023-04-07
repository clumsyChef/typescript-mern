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

    const message = {
        jwtExp: typeof decoded === "string" && decoded.includes("jwt expired"),
        value: decoded,
    };

    return message;
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!refreshToken) return next();
    const [accessSecret, refreshSecret] = [process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET];
    if (accessSecret && refreshSecret) {
        const [access, refresh] = [verifyToken(accessToken, accessSecret), verifyToken(refreshToken, refreshSecret)];
    } else {
        // create a error logger that "the token secret was not found"
        return res.json({ status: false, message: `Something went wrong` });
    }
    // if (!accessToken) {
    //     let decodedRefresh;
    //     try {
    //         decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? "");
    //     } catch (err: any) {
    //         decodedRefresh = err.message;
    //     }

    //     if (typeof decodedRefresh === "string" && decodedRefresh.includes("jwt expired")) return next();

    //     const findWithId = await UserModels.get(decodedRefresh.id);
    //     const findWithEmail = await UserModels.getAll({ email: decodedRefresh.email });
    //     let newDataToSave;
    //     if (!findWithId || !findWithEmail?.[0]) {
    //         newDataToSave = findWithId ?? findWithEmail?.[0];
    //     }

    //     if (newDataToSave) {
    //         newDataToSave = { ...newDataToSave, refreshToken: null };
    //         const userData = await UserModels.update(newDataToSave);
    //         return next();
    //     } else {
    //         return next();
    //     }

    //     // let newDataToSave;
    //     // if (!findWithId && findWithEmail?.[0]) {
    //     //     newDataToSave = { ...findWithEmail[0], refreshToken: null };
    //     // } else if (findWithId && !findWithEmail?.[0]) {
    //     //     newDataToSave = { ...findWithId, refreshToken: null };
    //     // }

    //     // if (newDataToSave) {
    //     //     const user = await UserModels.update(newDataToSave);
    //     // }

    //     // const cred = {
    //     //     id: decodedRefresh.id,
    //     //     email: decodedRefresh.email,
    //     // };
    //     // const user = await UserModels.getForJwtVerification(cred);

    //     // if (!user) {

    //     // }

    //     // someone manipulated with the token
    //     // if (!foundUser) {
    //     //     const newData = { ...userWithEmail, refreshToken: null };
    //     // }
    // } else {
    //     // let decodedAcc
    //     // req.user =
    // }
};
// export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
//     const { accessToken, refreshToken } = req.cookies;
//     console.log(`Refresh: ${refreshToken ? "YES" : "NO"},\nAccess: ${accessToken ? "YES" : "NO"}`);
//     if (!refreshToken) return next();

//     let decodedAccess;
//     try {
//         decodedAccess = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET ?? "");
//     } catch (err: any) {
//         decodedAccess = err.message;
//     }

//     console.log(decodedAccess);
//     if (typeof decodedAccess === "string" && decodedAccess.includes("jwt expired")) {
//         let decodedRefresh;
//         try {
//             decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? "");
//         } catch (err: any) {
//             decodedRefresh = err.message;
//         }
//         if (typeof decodedRefresh === "string" && decodedRefresh.includes("jwt expired")) {
//             return next();
//         } else {
//             const { email, id } = decodedRefresh;
//             const userData = await UserModels.get(id);
//             if (!userData || !userData.refreshToken) return next();

//             const newAccessToken = jwt.sign({ email, id }, process.env.ACCESS_TOKEN_SECRET ?? "", {
//                 expiresIn: "10s",
//             });

//             res.cookie("accessToken", newAccessToken, {
//                 maxAge: 10 * 1000,
//                 httpOnly: true,
//             });

//             console.log("NEW ACCESS TOKEN GENERATED");

//             let againAccess = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET ?? "");
//             // @ts-ignore
//             req.user = againAccess;

//             return next();
//         }
//     } else {
//         // @ts-ignore
//         req.user = decodedAccess;
//         return next();
//     }
// };
