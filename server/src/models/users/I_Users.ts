export interface I_GetParams {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string;
    mobile?: string;
    refreshToken?: string;
}

export interface I_UserData {
    id: string;
    username: string;
    fullName: string;
    email: string;
    password: string;
    mobile: string;
    refreshToken: string | null;
}

export interface I_JwtVerification {
    id: string;
    email: string;
}
