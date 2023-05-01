interface I_Params {
	id?: string;
	username?: string;
	email?: string;
	fullName?: string;
	mobile?: string;
	refreshToken?: string;
}

interface I_User {
	id: string;
	username: string;
	fullName: string;
	email: string;
	password: string;
	mobile: string;
	refreshToken?: string | null;
}

interface I_JwtVerification {
	id: string;
	email: string;
}

// interface I_Error {
// 	status: false;
// 	error: string;
// }

// interface I_Success {
// 	status: true;
// 	message: string;
// }

interface I_Success_Or_Error {
	status: boolean;
	error?: string;
	message?: string;
}

interface I_UserData {
	status: true;
	data: I_UserData;
}

// interface I_
