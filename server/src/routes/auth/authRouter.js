"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
exports.authRouter = express_1.default.Router();
exports.authRouter.route("/login").post(controllers_1.AuthController.login);
exports.authRouter.route("/logout").post(controllers_1.AuthController.logout);
