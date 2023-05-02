export interface I_Params {
	id?: string;
	username?: string;
	email?: string;
	fullName?: string;
	mobile?: string;
	refreshToken?: string;
}

export interface I_User {
	id: string;
	username: string;
	fullName: string;
	email: string;
	password: string;
	mobile: string;
	refreshToken?: string | null;
}

export interface I_JwtVerification {
	id: string;
	email: string;
}

export interface I_Success_Or_Error {
	status: boolean;
	error?: string;
	message?: string;
}

export interface I_UserData {
	status: true;
	data: I_User[];
}

// interface I_
