import { Router, RequestHandler } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { generateToken } from "../config/jwt";
import { RegisterBody, AuthResponse } from "../types/auth";

const router = Router();

const register: RequestHandler<{}, AuthResponse, RegisterBody> = async (
    req,
    res
) => {
    try {
        const { email, password } = req.body;
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
        });

        const token = generateToken({ id: user._id, email: user.email });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};

const login: RequestHandler<{}, AuthResponse, RegisterBody> = async (
    req,
    res
) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = generateToken({ id: user._id, email: user.email });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

router.post("/register", register);
router.post("/login", login);

export default router;
