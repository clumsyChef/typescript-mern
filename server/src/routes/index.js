"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.userRouter = exports.rootRouter = void 0;
const rootRouter_1 = require("./root/rootRouter");
Object.defineProperty(exports, "rootRouter", { enumerable: true, get: function () { return rootRouter_1.rootRouter; } });
const userRouter_1 = require("./user/userRouter");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return userRouter_1.userRouter; } });
const authRouter_1 = require("./auth/authRouter");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return authRouter_1.authRouter; } });
