import { userCollection } from "../../server";
import type { I_User, I_Error, I_Success, I_Params, I_UserData, I_JwtVerification } from "../../../types";

const get = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			//
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};

const create = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			//
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};

const update = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			//
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};

const remove = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			//
		} catch (err) {
			if (err instanceof Error) {
				resolve({ status: false, error: err.message });
			} else {
				resolve({ status: false, error: "Unexpected Error." });
			}
		}
	});
};
