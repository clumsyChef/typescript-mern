"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("../../models");
dotenv_1.default.config();
const verifyToken = (token, secret) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        decoded = error.message;
    }
    const message = {
        expired: typeof decoded === "string" && decoded.includes("jwt expired"),
        noJwt: typeof decoded === "string" && decoded === "jwt must be provided",
    };
    if (!message.expired && !message.noJwt) {
        message.value = decoded;
    }
    return message;
};
const createNewAccessToken = () => { };
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { accessToken, refreshToken } = req.cookies;
    const [accessSecret, refreshSecret] = [
        process.env.ACCESS_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_SECRET,
    ];
    if (accessToken && refreshToken) {
        const verifiedAccess = verifyToken(accessToken, accessSecret);
        if (verifiedAccess.value) {
            // @ts-ignore
            req.user = verifiedAccess.value;
        }
        else {
            const verifiedRefresh = verifyToken(refreshToken, refreshSecret);
            const userData = yield models_1.UserModels.getAll({ refreshToken });
            if (verifiedRefresh.value) {
                const tokenData = { id: userData[0].id, email: userData[0].email };
                const newAccessToken = jsonwebtoken_1.default.sign(tokenData, accessSecret, {
                    expiresIn: "10s",
                });
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    maxAge: 10 * 1000,
                });
                console.log("New Access Token Generated");
                // @ts-ignore
                req.user = tokenData;
            }
            else if (verifiedRefresh.expired && (userData === null || userData === void 0 ? void 0 : userData.length)) {
                const newData = Object.assign(Object.assign({}, userData[0]), { refreshToken: null });
                const data = yield models_1.UserModels.update(newData);
            }
        }
    }
    return next();
});
exports.verifyUser = verifyUser;
