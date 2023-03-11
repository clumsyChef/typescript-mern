import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";

const get = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // const data = await UserModels.get();
};

const create = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { username, fullName, email, mobile, password } = req.body;
    if (username && fullName && email && mobile) {
        const userData = await UserModels.get({ username, email });
        if (!userData) {
            const hashedPass = await bcrypt.hash(password, 10);
            const dataToSave = {
                username,
                fullName,
                email,
                mobile,
                password: hashedPass,
            };
            const createdUser = await UserModels.create(dataToSave);
            if (createdUser) {
                res.json({
                    status: true,
                    message: `Account with username "${username}" created by ${fullName}.`,
                });
            }
        } else if (userData.username === username && userData.email === email) {
            res.json({
                status: true,
                message: "Username and Email already exists.",
            });
        } else if (userData.username === username) {
            res.json({
                status: true,
                message: "Username already exists.",
            });
        } else if (userData.email === email) {
            res.json({
                status: true,
                message: "Email already exists.",
            });
        }
    } else {
        res.json({
            status: false,
            message: "All fields are required to create a user.",
        });
    }
};

const update = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const data = UserModels.update();
};

const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const data = UserModels.remove();
};

const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const data = await UserModels.getAll();
    if (data) {
        res.json({ status: true, data });
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
