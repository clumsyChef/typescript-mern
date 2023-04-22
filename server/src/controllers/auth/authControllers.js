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
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    if (req.user) {
        res.json({ status: false, message: "Already Logged In" });
        return;
    }
    const { email, password } = req.body;
    if (email && password) {
        const userData = yield models_1.UserModels.getAll({ email });
        if (userData === null || userData === void 0 ? void 0 : userData.length) {
            const match = yield bcrypt_1.default.compare(password, userData[0].password);
            if (match) {
                const [accessSecret, refreshSecret] = [
                    process.env.ACCESS_TOKEN_SECRET,
                    process.env.REFRESH_TOKEN_SECRET,
                ];
                if (accessSecret && refreshSecret) {
                    const accessToken = jsonwebtoken_1.default.sign({ id: userData[0].id, email }, accessSecret, { expiresIn: "10s" });
                    const refreshToken = jsonwebtoken_1.default.sign({ id: userData[0].id, email }, refreshSecret, { expiresIn: "1d" });
                    const dataWithToken = Object.assign(Object.assign({}, userData[0]), { refreshToken });
                    const changedData = yield models_1.UserModels.update(dataWithToken);
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        // sameSite: "none",
                        // secure: true,
                        maxAge: 100 * 1000,
                    });
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        // sameSite: "none",
                        // secure: true,
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.status(200).json({ status: true, message: `You are now logged in as ${email}` });
                }
                else {
                    // create a error logger that "the token secret was not found"
                    res.status(401).json({ status: false, message: "Something went wrong." });
                }
            }
            else {
                res.status(403).json({ status: false, message: "Invalid credentials." });
            }
        }
        else {
            res.status(401).json({
                status: false,
                message: "No such user exists.",
            });
        }
    }
    else {
        res.status(401).json({
            status: false,
            message: "Both Email and Password are required.",
        });
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const userData = yield models_1.UserModels.getAll({ refreshToken });
    if (userData === null || userData === void 0 ? void 0 : userData[0]) {
        const newUserData = Object.assign(Object.assign({}, userData[0]), { refreshToken: null });
        yield models_1.UserModels.update(newUserData);
    }
    res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
    });
    res.cookie("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
    });
    return next();
});
exports.AuthController = { login, logout };
