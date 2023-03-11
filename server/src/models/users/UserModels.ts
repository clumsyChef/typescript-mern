import type { Request } from "express";
import data from "../../../db/users.json";

interface I_GetParams {
    id?: string;
    username?: string;
    email?: string;
}

const get = (getParams: I_GetParams) => {
    const { id, username, email } = getParams;

    return new Promise((resolve, reject) => {
        const userData = data.find((item) => {
            if (id) item?.[id] === id;
            if (username) item?.[username] === username;
            if (email) item?.[email] === email;
        });
        if (userData) {
            resolve({ status: true, data: userData });
        } else {
            reject({ status: false, message: "No user found" });
        }
    });
};

const create = (req: Request) => {};

const update = () => {};

const remove = () => {};

const getAll = (): Promise<object[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};

export const UserModels = {
    get,
    create,
    update,
    remove,
    getAll,
};
