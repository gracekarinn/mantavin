export interface RegisterBody {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
}
