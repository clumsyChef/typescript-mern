import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import { v4 as uuidv4 } from "uuid";
import { I_UserData } from "../../models/users/I_Users";

const get = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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

        if (userData) {
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

const create = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { username, fullName, email, mobile, password } = req.body;
    if (username && fullName && email && mobile) {
        const userData: I_UserData[] = await UserModels.getAll({
            username,
            email,
        });
        const { duplicateUsername, duplicateEmail } = userData?.reduce(
            (acc, curr) => {
                if (curr.username === username) acc.duplicateUsername = true;
                if (curr.email === email) acc.duplicateEmail = true;
                return acc;
            },
            { duplicateUsername: false, duplicateEmail: false }
        );
        if (duplicateUsername && duplicateEmail) {
            res.status(400).json({
                status: false,
                message: "Username and Email already exists.",
            });
        } else if (duplicateUsername) {
            res.status(400).json({
                status: false,
                message: "Username already exists.",
            });
        } else if (duplicateEmail) {
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
            };
            const createdUser = await UserModels.create(dataToSave);
            if (createdUser) {
                res.status(201).json({
                    status: true,
                    message: `Account with username "${username}" created by ${fullName}.`,
                });
            }
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
