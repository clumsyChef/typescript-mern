import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import { I_User } from "../../../types";

const get = (req: Request, res: Response, next: NextFunction) => {
	//
};

const create = (req: Request, res: Response, next: NextFunction) => {
	//
};

const update = (req: Request, res: Response, next: NextFunction) => {
	//
};

const remove = (req: Request, res: Response, next: NextFunction) => {
	//
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
	//
};

export const BlogController = { get, create, update, remove, getAll };
