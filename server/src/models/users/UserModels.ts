import type { I_GetParams, I_UserData } from "./I_Users";
// import data from "../../../db/users.json";
import { appendToUsers } from "../../utils/dataManipulation";

const get = (id: string): Promise<I_UserData | undefined> => {
    const data: I_UserData[] = require("../../../db/users.json");
    return new Promise((resolve, reject) => {
        const userData = data.find((item: I_UserData) => item.id === id);
        resolve(userData);
    });
};

const create = (dataToSave: I_UserData) => {
    const data: I_UserData[] = require("../../../db/users.json");
    const newData = [...data, dataToSave];
    const newDataAsStr: string = JSON.stringify(newData, null, 4);
    return new Promise((resolve, reject) => {
        appendToUsers(newDataAsStr);
        resolve(true);
    });
};

const update = () => {};

const remove = () => {};

const getAll = (getParams?: I_GetParams): Promise<I_UserData[]> => {
    const data: I_UserData[] = require("../../../db/users.json");
    if (getParams) {
        const { username, email, fullName, mobile } = getParams;
        return new Promise((resolve, reject) => {
            const requiredData = data?.filter((item, index) => {
                if (
                    username &&
                    item.username
                        .toLowerCase()
                        .includes(username?.toLowerCase())
                )
                    return item;

                if (
                    email &&
                    item.email.toLowerCase().includes(email?.toLowerCase())
                )
                    return item;

                if (
                    fullName &&
                    item.fullName
                        .toLowerCase()
                        .includes(fullName?.toLowerCase())
                )
                    return item;

                if (
                    mobile &&
                    item.mobile.toLowerCase().includes(mobile?.toLowerCase())
                )
                    return item;
            });

            resolve(requiredData);
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }
};

export const UserModels = {
    get,
    create,
    update,
    remove,
    getAll,
};
