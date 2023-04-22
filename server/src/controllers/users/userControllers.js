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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../../models");
const uuid_1 = require("uuid");
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username, email, fullName, mobile } = req.body;
    if (id) {
        const userData = yield models_1.UserModels.get(id);
        if (userData) {
            res.status(200).json({ status: true, data: userData });
        }
        else {
            res.status(404).json({ status: false, message: `User Not Found.` });
        }
    }
    if (username || email || fullName || mobile) {
        const userData = yield models_1.UserModels.getAll({
            username,
            email,
            fullName,
            mobile,
        });
        if (userData === null || userData === void 0 ? void 0 : userData.length) {
            const withoutPasswords = userData.map((item) => {
                const { password } = item, rest = __rest(item, ["password"]);
                return rest;
            });
            res.status(200).json({ status: true, data: withoutPasswords });
        }
        else {
            res.status(400).json({ status: false, message: "No User Found." });
        }
    }
    else {
        res.status(404).json({ status: false, message: "No User Found." });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, fullName, email, mobile, password } = req.body;
    if (username && fullName && email && mobile) {
        const userData = yield models_1.UserModels.getAll({ email });
        if (userData === null || userData === void 0 ? void 0 : userData.length) {
            res.status(400).json({
                status: false,
                message: "Email already exists.",
            });
        }
        else {
            const hashedPass = yield bcrypt_1.default.hash(password, 10);
            const dataToSave = {
                id: (0, uuid_1.v4)(),
                username,
                fullName,
                email,
                mobile,
                password: hashedPass,
                refreshToken: null,
            };
            const createdUser = yield models_1.UserModels.create(dataToSave);
            if (createdUser) {
                res.status(201).json({
                    status: true,
                    message: `Account with username "${username}" created by ${fullName}.`,
                });
            }
        }
    }
    else {
        res.status(401).json({
            status: false,
            message: "All fields are required to create a user.",
        });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newData = req.body;
    if (newData === null || newData === void 0 ? void 0 : newData.id) {
        const userData = yield models_1.UserModels.get(newData.id);
        if (userData) {
            const dataToSave = Object.assign(Object.assign({}, userData), newData);
            dataToSave.password = yield bcrypt_1.default.hash(dataToSave.password, 10);
            const savedData = yield models_1.UserModels.update(dataToSave);
            if (savedData) {
                const { id, password } = newData, rest = __rest(newData, ["id", "password"]);
                res.status(201).json({ status: true, data: rest });
            }
            else {
                res.status(400).json({
                    status: false,
                    message: `There was some problem in saving the user data.`,
                });
            }
        }
    }
    else {
        res.status(403).json({ status: false, message: "Forbidden." });
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (id) {
        const userData = yield models_1.UserModels.get(id);
        if (userData) {
            const removeUser = yield models_1.UserModels.remove(id);
            if (removeUser) {
                res.status(200).json({
                    status: false,
                    message: `User removed`,
                });
            }
            else {
                res.status(400).json({
                    status: false,
                    message: "Something went wrong.",
                });
            }
        }
        else {
            res.status(400).json({
                status: false,
                message: "Something went wrong.",
            });
        }
    }
    else {
        res.status(401).json({ status: false, message: "Forbidden" });
    }
});
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield models_1.UserModels.getAll();
    if (userData) {
        res.json({ status: true, data: userData });
    }
    else {
        res.json({ status: false, message: "No Data Found." });
    }
});
exports.UserController = {
    get,
    create,
    update,
    remove,
    getAll,
};
