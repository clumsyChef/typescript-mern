import data from "../../../db/users.json";
import { appendToUsers } from "../../utils/dataManipulation";
import { userCollection } from "../../server";

// const get = async (id: string): Promise<I_UserData | undefined> => {
// 	return new Promise((resolve, reject) => {
// 		const userData = data.find((item: I_UserData) => item.id === id);
// 		resolve(userData);
// 	});
// };

const create = async (dataToSave: I_User): Promise<I_Success_Or_Error> => {
	return new Promise(async (resolve, reject) => {
		try {
			await userCollection.insertOne(dataToSave);
			resolve({ status: true, message: `User created with Email: ${dataToSave.email}` });
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, message: err.message });
			} else {
				resolve({ status: false, message: "Unexpected Error." });
			}
		}
	});
};

const update = async (dataToSave: I_UserData) => {
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

const remove = async (id: string) => {
	const changedData: I_UserData[] = data?.filter((item) => {
		if (item.id !== id) return item;
	});

	const newDataAsStr: string = JSON.stringify(changedData, null, 4);
	return new Promise((resolve, reject) => {
		appendToUsers(newDataAsStr);
		resolve(id);
	});
};

const getAll = async (getParams?: I_Params): Promise<I_UserData[] | I_Success_Or_Error> => {
	if (getParams) {
		const { username, email, fullName, mobile, refreshToken } = getParams;
		return new Promise(async (resolve, reject) => {
			try {
				const requiredData: any = await userCollection.find({
					$or: [{ username }, { email }, { fullName }, { mobile }, { refreshToken }],
				});
				// .toArray();

				resolve({ status: true, data: [requiredData] });
			} catch (err) {
				if (err instanceof Error) {
					resolve({ status: false, error: err.message });
				} else {
					resolve({ status: false, error: "Unexpected Error." });
				}
			}
		});
	} else {
		return new Promise((resolve, reject) => {
			try {
				const requiredData: any = userCollection.find().toArray();
				resolve(requiredData);
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

const getForJwtVerification = async (creds: I_JwtVerification) => {
	const { id, email } = creds;
	return new Promise((resolve, reject) => {
		const userData = data.find((item) => item.id === id && item.email === email);
		resolve(userData);
	});
};

export const UserModels = {
	// get,
	create,
	update,
	remove,
	getAll,
	getForJwtVerification,
};
