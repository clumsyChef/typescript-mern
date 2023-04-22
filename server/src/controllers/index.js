"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.UserController = void 0;
const userControllers_1 = require("./users/userControllers");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return userControllers_1.UserController; } });
const authControllers_1 = require("./auth/authControllers");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return authControllers_1.AuthController; } });
