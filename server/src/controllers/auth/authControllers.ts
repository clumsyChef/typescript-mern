// @ts-nocheck
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import { UserModels } from "../../models";
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// @ts-ignore
	if (req.user) {
		res.json({ status: false, message: "Already Logged In" });
		return;
	}
	const { email, password } = req.body;
	if (email && password) {
		const userData = await UserModels.getAll({ email });
		if (!userData.status && userData?.length) {
			const match = await bcrypt.compare(password, userData[0].password);
			if (match) {
				const [accessSecret, refreshSecret] = [
					process.env.ACCESS_TOKEN_SECRET as string,
					process.env.REFRESH_TOKEN_SECRET as string,
				];
				if (accessSecret && refreshSecret) {
					const accessToken = jwt.sign({ id: userData[0].id, email }, accessSecret, { expiresIn: "10s" });
					const refreshToken = jwt.sign({ id: userData[0].id, email }, refreshSecret, { expiresIn: "30s" });
					const dataWithToken = { ...userData[0], refreshToken };
					await UserModels.update(dataWithToken);
					res.cookie("accessToken", accessToken, {
						httpOnly: true,
						// sameSite: "none",
						// secure: true,
						maxAge: 20 * 1000,
					});
					res.cookie("refreshToken", refreshToken, {
						httpOnly: true,
						// sameSite: "none",
						// secure: true,
						maxAge: 24 * 60 * 60 * 1000,
					});
					res.status(200).json({ status: true, message: `You are now logged in as ${email}` });
				} else {
					// create a error logger that "the token secret was not found"
					res.status(401).json({ status: false, message: "Something went wrong." });
				}
			} else {
				res.status(403).json({ status: false, message: "Invalid credentials." });
			}
		} else {
			res.status(401).json({
				status: false,
				message: "No such user exists.",
			});
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
	if (userData?.[0]) {
		const newUserData = { ...userData[0], refreshToken: null };
		await UserModels.update(newUserData);
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
