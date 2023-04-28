import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import { v4 as uuidv4 } from "uuid";
import { I_UserData } from "../../models/users/I_Users";

const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, username, email, fullName, mobile } = req.body;
    if (id) {
        const userData = await UserModels.get(id);
        if (userData) {
            res.status(200).json({ status: true, data: userData });
        } else {
            res.status(404).json({ status: false, message: `User Not Found.` });
        }
    }
    if (username || email || fullName || mobile) {
        const userData: I_UserData[] = await UserModels.getAll({
            username,
            email,
            fullName,
            mobile,
        });

        if (userData?.length) {
            const withoutPasswords = userData.map((item) => {
                const { password, ...rest } = item;
                return rest;
            });
            res.status(200).json({ status: true, data: withoutPasswords });
        } else {
            res.status(400).json({ status: false, message: "No User Found." });
        }
    } else {
        res.status(404).json({ status: false, message: "No User Found." });
    }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, fullName, email, mobile, password } = req.body;

    if (username && fullName && email && mobile) {
        const userData: I_UserData[] = await UserModels.getAll({ email });
        if (userData?.length) {
            res.status(400).json({
                status: false,
                message: "Email already exists.",
            });
        } else {
            const hashedPass = await bcrypt.hash(password, 10);
            const dataToSave = {
                id: uuidv4(),
                username,
                fullName,
                email,
                mobile,
                password: hashedPass,
                refreshToken: null,
            };
            const createdUser = await UserModels.create(dataToSave);
            if (createdUser.status) {
                res.status(201).json({
                    status: true,
                    message: `Account with username "${username}" created by ${fullName}.`,
                });
            } else {
                res.status(500).json({ status: false, message: "Data cannot be saved" });
            }
        }
    } else {
        res.status(401).json({
            status: false,
            message: "All fields are required to create a user.",
        });
    }
};

const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newData = req.body;

    if (newData?.id) {
        const userData = await UserModels.get(newData.id);
        if (userData) {
            const dataToSave = { ...userData, ...newData };
            dataToSave.password = await bcrypt.hash(dataToSave.password, 10);
            const savedData = await UserModels.update(dataToSave);
            if (savedData) {
                const { id, password, ...rest } = newData;
                res.status(201).json({ status: true, data: rest });
            } else {
                res.status(400).json({
                    status: false,
                    message: `There was some problem in saving the user data.`,
                });
            }
        }
    } else {
        res.status(403).json({ status: false, message: "Forbidden." });
    }
};

const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.body;
    if (id) {
        const userData: I_UserData | undefined = await UserModels.get(id);
        if (userData) {
            const removeUser = await UserModels.remove(id);
            if (removeUser) {
                res.status(200).json({
                    status: false,
                    message: `User removed`,
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: "Something went wrong.",
                });
            }
        } else {
            res.status(400).json({
                status: false,
                message: "Something went wrong.",
            });
        }
    } else {
        res.status(401).json({ status: false, message: "Forbidden" });
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData = await UserModels.getAll();
    if (userData) {
        res.json({ status: true, data: userData });
    } else {
        res.json({ status: false, message: "No Data Found." });
    }
};

export const UserController = {
    get,
    create,
    update,
    remove,
    getAll,
};
