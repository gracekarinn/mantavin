export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}
export interface RegisterBody {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
}
