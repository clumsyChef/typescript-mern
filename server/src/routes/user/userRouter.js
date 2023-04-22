"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
exports.userRouter = express_1.default.Router();
exports.userRouter
    .route("/")
    .get(controllers_1.UserController.get)
    .post(controllers_1.UserController.create)
    .put(controllers_1.UserController.update)
    .delete(controllers_1.UserController.remove);
exports.userRouter.route("/all").get(controllers_1.UserController.getAll);
