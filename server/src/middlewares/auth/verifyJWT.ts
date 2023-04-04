import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

// const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader: string | undefined = req.headers["authorization"];
//     if (!authHeader) return res.sendStatus(404);
//     const token: string = authHeader.split(" ")[1];
//     const accessToken = process.env.ACCESS_TOKEN_SECRET;
//     if (accessToken) {
//         jwt.verify(token, accessToken, (err, decoded) => {
//             if (err) return res.sendStatus(403);
//             if (decoded) {
//                 // @ts-ignore
//                 req.email = decoded.email;
//                 next();
//             }
//             return res.sendStatus(403);
//         });
//     }
// };

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken || !refreshToken) return next();

    let decodedAccess;
    try {
        decodedAccess = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET ?? "");
    } catch (err: any) {
        decodedAccess = err.message;
    }

    if (decodedAccess.includes("jwt expired")) {
        let decodedRefresh;
        try {
            decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOEKN_SECRET ?? "");
        } catch (err: any) {
            decodedRefresh = err.message;
        }
    } else {
        //
    }
};
export { verifyUser };
