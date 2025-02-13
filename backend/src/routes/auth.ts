import { Router, RequestHandler } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { generateToken } from "../config/jwt";
import { RegisterBody } from "../types/auth";
import { authenticateToken } from "../middleware/auth";

const router = Router();

const register: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body as RegisterBody;
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

        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};

const login: RequestHandler = async (req, res): Promise<void> => {
    try {
        const { email, password } = req.body as RegisterBody;
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

        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

const getCurrentUser: RequestHandler = async (req, res): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({
            id: user._id.toString(),
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: "Error getting user data" });
    }
};

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
