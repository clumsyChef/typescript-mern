import type { I_GetParams, I_UserData } from "./I_Users";
import data from "../../../db/users.json";
import { appendToUsers } from "../../utils/dataManipulation";

const get = (getParams: I_GetParams): Promise<I_UserData | undefined> => {
    const { id, username, email, fullName, mobile } = getParams;

    return new Promise((resolve, reject) => {
        const userData = data.find((item: I_UserData) => {
            return (
                item.id === id ||
                item.username === username ||
                item.email === email ||
                item.fullName === fullName ||
                item.mobile === mobile
            );
        });

        resolve(userData);
    });
};

const create = (dataToSave: I_UserData) => {
    const newData = [...data, dataToSave];
    const newDataAsStr: string = JSON.stringify(newData, null, 4);
    return new Promise((resolve, reject) => {
        appendToUsers(newDataAsStr);
        resolve(true);
    });
};

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
