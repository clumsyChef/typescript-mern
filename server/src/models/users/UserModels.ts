import { userCollection } from "../../server";
import type { I_User, I_Error, I_Success, I_Params, I_UserData } from "../../../types";

const get = async (id: string): Promise<I_UserData | I_Error> => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await userCollection.findOne({ id });
			if (user) {
				resolve({ status: true, data: user });
			} else {
				resolve({ status: false, error: "No User Found." });
			}
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};

const create = async (dataToSave: I_User): Promise<I_Error | I_Success> => {
	return new Promise(async (resolve, reject) => {
		try {
			await userCollection.insertOne(dataToSave);
			resolve({ status: true, message: `User created with Email: ${dataToSave.email}` });
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};

const update = async (dataToSave: I_User) => {
	return new Promise(async (resolve, reject) => {
		try {
			await userCollection.updateOne({ id: dataToSave.id }, { $set: dataToSave });
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, message: err.message });
			} else {
				resolve({ status: false, message: "Unexpected Error." });
			}
		}
		resolve(dataToSave);
	});
};

const remove = async (id: string): Promise<I_Success | I_Error> => {
	return new Promise(async (resolve, reject) => {
		try {
			await userCollection.deleteOne({ id });
			resolve({ status: true, message: "User Successfully deleted." });
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};

const getAll = async (getParams?: I_Params): Promise<I_UserData | I_Error> => {
	if (getParams) {
		const { username, email, fullName, mobile, refreshToken } = getParams;
		return new Promise(async (resolve, reject) => {
			try {
				const requiredData: any = await userCollection
					.find({
						$or: [{ username }, { email }, { fullName }, { mobile }, { refreshToken }],
					})
					.toArray();

				resolve({ status: true, data: requiredData });
			} catch (err) {
				if (err instanceof Error) {
					resolve({ status: false, error: err.message });
				} else {
					resolve({ status: false, error: "Unexpected Error." });
				}
			}
		});
	} else {
		return new Promise(async (resolve, reject) => {
			try {
				const requiredData: any = await userCollection.find().toArray();
				resolve({ status: true, data: requiredData });
			} catch (err) {
				if (err instanceof Error) {
					resolve({ status: false, error: err.message });
				} else {
					resolve({ status: false, error: "Unexpected Error." });
				}
			}
		});
	}
};

export const UserModels = {
	get,
	create,
	update,
	remove,
	getAll,
};
