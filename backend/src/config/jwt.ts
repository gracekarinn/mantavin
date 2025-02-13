import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { UserPayload } from "../types/auth";
import dotenv from "dotenv";

dotenv.config();

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET,
    expiresIn: 86400,
};

export const generateToken = (payload: Partial<UserPayload>): string => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.expiresIn,
    };
    return jwt.sign(payload, JWT_CONFIG.secret as Secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_CONFIG.secret as Secret) as JwtPayload;
};
