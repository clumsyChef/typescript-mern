import type { I_GetParams, I_UserData } from "./I_Users";
import data from "../../../db/users.json";
import { appendToUsers } from "../../utils/dataManipulation";

const get = (getParams: I_GetParams): Promise<I_UserData | undefined> => {
    const { id, username, email } = getParams;

    return new Promise((resolve, reject) => {
        const userData = data.find((item: I_UserData) => {
            return (
                item.id === id ||
                item.username === username ||
                item.email === email
            );
        });

        resolve(userData);
    });
};

const create = (dataToSave: I_UserData) => {
    const newData = [...data, dataToSave];
    const newDataAsStr: string = JSON.stringify(newData);
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
