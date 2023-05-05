import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import jwt from "jsonwebtoken";
import { I_User } from "../../../types";

const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
	// @ts-ignore
	if (req.user) {
		return res.json({ status: false, message: "Already Logged In" });
	}
	const { email, password } = req.body;
	if (email && password) {
		const userData = await UserModels.getAll({ email });
		if (!userData.status) {
			return res.json(userData);
		} else {
			if (userData?.data?.length) {
				const user: I_User = userData.data[0];
				const match = await bcrypt.compare(password, user.password);
				if (match) {
					const [accessSecret, refreshSecret] = [
						process.env.ACCESS_TOKEN_SECRET as string,
						process.env.REFRESH_TOKEN_SECRET as string,
					];
					if (accessSecret && refreshSecret) {
						const accessToken = jwt.sign({ id: user.id, email }, accessSecret, {
							expiresIn: "10s",
						});
						const refreshToken = jwt.sign({ id: user.id, email }, refreshSecret, {
							expiresIn: "30s",
						});
						const dataWithToken: I_User = { ...user, refreshToken };
						await UserModels.update(dataWithToken);
						res.cookie("accessToken", accessToken, {
							httpOnly: true,
							maxAge: 20 * 1000,
						});
						res.cookie("refreshToken", refreshToken, {
							httpOnly: true,
							maxAge: 24 * 60 * 60 * 1000,
						});
						return res.status(200).json({
							status: true,
							message: `You are now logged in as ${email}. Redirect user from here to somewhere.`,
						});
					} else {
						// create a error logger that "the token secret was not found"
						return res.status(401).json({ status: false, message: "Something went wrong." });
					}
				} else {
					return res.status(403).json({ status: false, message: "Invalid credentials." });
				}
			} else {
				return res.status(401).json({
					status: false,
					message: "No such user exists.",
				});
			}
		}
	} else {
		res.status(401).json({
			status: false,
			message: "Both Email and Password are required.",
		});
	}
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<Record<string, any>> => {
	const { refreshToken } = req.cookies;
	const userData = await UserModels.getAll({ refreshToken });
	if (userData.status) {
		const user: I_User = userData.data[0];
		if (user) {
			const newUserData = { ...user, refreshToken: null };
			await UserModels.update(newUserData);
		}
	}
	res.cookie("accessToken", "", {
		maxAge: 0,
		httpOnly: true,
	});

	res.cookie("refreshToken", "", {
		maxAge: 0,
		httpOnly: true,
	});

	return res.json({ status: true, message: "User Successfully logged out. Now redirect user to somewhere." });
};

export const AuthController = { login, logout };
