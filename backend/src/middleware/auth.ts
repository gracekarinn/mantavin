import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";
import { UserPayload } from "../types/auth";

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded as UserPayload;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};
