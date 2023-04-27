import type { I_GetParams, I_UserData, I_JwtVerification } from "./I_Users";
import data from "../../../db/users.json";
import { appendToUsers } from "../../utils/dataManipulation";
import { userCollection } from "../../server";

const get = async (id: string): Promise<I_UserData | undefined> => {
    return new Promise((resolve, reject) => {
        const userData = data.find((item: I_UserData) => item.id === id);
        resolve(userData);
    });
};

const create = async (dataToSave: I_UserData) => {
    const newData = [...data, dataToSave];
    const newDataAsStr: string = JSON.stringify(newData, null, 4);
    return new Promise((resolve, reject) => {
        appendToUsers(newDataAsStr);
        resolve(true);
    });
};

const update = async (dataToSave: I_UserData) => {
    const changedData: I_UserData[] = data?.map((item) => {
        return item.id === dataToSave.id ? dataToSave : item;
    });

    const newDataAsStr: string = JSON.stringify(changedData, null, 4);

    return new Promise((resolve, reject) => {
        appendToUsers(newDataAsStr);
        resolve(dataToSave);
    });
};

const remove = async (id: string) => {
    const changedData: I_UserData[] = data?.filter((item) => {
        if (item.id !== id) return item;
    });

    const newDataAsStr: string = JSON.stringify(changedData, null, 4);
    return new Promise((resolve, reject) => {
        appendToUsers(newDataAsStr);
        resolve(id);
    });
};

const getAll = async (getParams?: I_GetParams): Promise<I_UserData[]> => {
    if (getParams) {
        const { username, email, fullName, mobile, refreshToken } = getParams;
        return new Promise(async (resolve, reject) => {
            const mainData = userCollection;
            // @ts-ignore
            const requiredData: any = await mainData.find({ email }).toArray();
            // const requiredData = mainData?.find({email: email})?.filter((item, index) => {
            //     if (username && item.username.toLowerCase().includes(username?.toLowerCase())) return item;

            //     if (email && item.email.toLowerCase().includes(email?.toLowerCase())) return item;

            //     if (fullName && item.fullName.toLowerCase().includes(fullName?.toLowerCase())) return item;

            //     if (mobile && item.mobile.toLowerCase().includes(mobile?.toLowerCase())) return item;

            //     if (refreshToken && item.refreshToken === refreshToken) return item;
            // });

            resolve(requiredData);
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }
};

const getForJwtVerification = async (creds: I_JwtVerification) => {
    const { id, email } = creds;
    return new Promise((resolve, reject) => {
        const userData = data.find((item) => item.id === id && item.email === email);
        resolve(userData);
    });
};

export const UserModels = {
    get,
    create,
    update,
    remove,
    getAll,
    getForJwtVerification,
};
