"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModels = void 0;
const users_json_1 = __importDefault(require("../../../db/users.json"));
const dataManipulation_1 = require("../../utils/dataManipulation");
const get = (id) => {
    return new Promise((resolve, reject) => {
        const userData = users_json_1.default.find((item) => item.id === id);
        resolve(userData);
    });
};
const create = (dataToSave) => {
    const newData = [...users_json_1.default, dataToSave];
    const newDataAsStr = JSON.stringify(newData, null, 4);
    return new Promise((resolve, reject) => {
        (0, dataManipulation_1.appendToUsers)(newDataAsStr);
        resolve(true);
    });
};
const update = (dataToSave) => {
    const changedData = users_json_1.default === null || users_json_1.default === void 0 ? void 0 : users_json_1.default.map((item) => {
        return item.id === dataToSave.id ? dataToSave : item;
    });
    const newDataAsStr = JSON.stringify(changedData, null, 4);
    return new Promise((resolve, reject) => {
        (0, dataManipulation_1.appendToUsers)(newDataAsStr);
        resolve(dataToSave);
    });
};
const remove = (id) => {
    const changedData = users_json_1.default === null || users_json_1.default === void 0 ? void 0 : users_json_1.default.filter((item) => {
        if (item.id !== id)
            return item;
    });
    const newDataAsStr = JSON.stringify(changedData, null, 4);
    return new Promise((resolve, reject) => {
        (0, dataManipulation_1.appendToUsers)(newDataAsStr);
        resolve(id);
    });
};
const getAll = (getParams) => {
    if (getParams) {
        const { username, email, fullName, mobile, refreshToken } = getParams;
        return new Promise((resolve, reject) => {
            const requiredData = users_json_1.default === null || users_json_1.default === void 0 ? void 0 : users_json_1.default.filter((item, index) => {
                if (username && item.username.toLowerCase().includes(username === null || username === void 0 ? void 0 : username.toLowerCase()))
                    return item;
                if (email && item.email.toLowerCase().includes(email === null || email === void 0 ? void 0 : email.toLowerCase()))
                    return item;
                if (fullName && item.fullName.toLowerCase().includes(fullName === null || fullName === void 0 ? void 0 : fullName.toLowerCase()))
                    return item;
                if (mobile && item.mobile.toLowerCase().includes(mobile === null || mobile === void 0 ? void 0 : mobile.toLowerCase()))
                    return item;
                if (refreshToken && item.refreshToken === refreshToken)
                    return item;
            });
            resolve(requiredData);
        });
    }
    else {
        return new Promise((resolve, reject) => {
            resolve(users_json_1.default);
        });
    }
};
const getForJwtVerification = (creds) => {
    const { id, email } = creds;
    return new Promise((resolve, reject) => {
        const userData = users_json_1.default.find((item) => item.id === id && item.email === email);
        resolve(userData);
    });
};
exports.UserModels = {
    get,
    create,
    update,
    remove,
    getAll,
    getForJwtVerification,
};
