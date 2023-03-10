import data from "../../../db/users.json";

const get = () => {};

const create = () => {};

const update = () => {};

const remove = () => {};

const getAll = () => {
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
