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
    const { username, fullName, email, mobile } = req.body;
    if (!username || !fullName || !email || !mobile) {
        res.json({
            status: false,
            message: "All fields are required to create a user.",
        });
    }

    const userExists = UserModels.get({ username, email });

    // const data = UserModels.create(req);
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
