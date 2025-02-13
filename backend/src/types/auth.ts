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

export interface UserPayload {
    id: string;
    email: string;
}

export interface RegisterBody {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
}

export interface UserResponse {
    id: string;
    email: string;
}
