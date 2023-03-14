import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import { v4 as uuidv4 } from "uuid";

const get = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id, username, email, fullName, mobile } = req.body;
    if (id || username || email || fullName || mobile) {
        const userData = await UserModels.get({
            id,
            username,
            email,
            fullName,
            mobile,
        });

        if (userData) {
            const { password, ...rest } = userData;
            res.status(200).json({ status: true, data: rest });
        } else {
            res.status(400).json({
                status: false,
                message: "No user exists for the provided data.",
            });
        }
    } else {
        res.status(404).json({ status: false, message: "User Not found" });
    }
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
                id: uuidv4(),
                username,
                fullName,
                email,
                mobile,
                password: hashedPass,
            };
            const createdUser = await UserModels.create(dataToSave);
            if (createdUser) {
                res.status(201).json({
                    status: true,
                    message: `Account with username "${username}" created by ${fullName}.`,
                });
            }
        } else if (userData.username === username && userData.email === email) {
            res.status(400).json({
                status: true,
                message: "Username and Email already exists.",
            });
        } else if (userData.username === username) {
            res.status(400).json({
                status: true,
                message: "Username already exists.",
            });
        } else if (userData.email === email) {
            res.status(400).json({
                status: true,
                message: "Email already exists.",
            });
        }
    } else {
        res.status(401).json({
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
