import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import { UserModels } from "../../models";

dotenv.config();

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!refreshToken) return next();

    if (!accessToken) {
        let decodedRefresh;
        try {
            decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? "");
        } catch (err: any) {
            decodedRefresh = err.message;
        }

        if (typeof decodedRefresh === "string" && decodedRefresh.includes("jwt expired")) return next();

        const findWithId = await UserModels.get(decodedRefresh.id);
        const findWithEmail = await UserModels.getAll({ email: decodedRefresh.email });
        let newDataToSave;
        if (!findWithId && findWithEmail?.[0]) {
            newDataToSave = { ...findWithEmail[0], refreshToken: null };
        } else if (findWithId && !findWithEmail?.[0]) {
            newDataToSave = { ...findWithId, refreshToken: null };
        }

        if (newDataToSave) {
            const user = await UserModels.update(newDataToSave);
        }

        // const cred = {
        //     id: decodedRefresh.id,
        //     email: decodedRefresh.email,
        // };
        // const user = await UserModels.getForJwtVerification(cred);

        // if (!user) {

        // }

        // someone manipulated with the token
        // if (!foundUser) {
        //     const newData = { ...userWithEmail, refreshToken: null };
        // }
    }
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
