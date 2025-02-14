import mongoose, { Document } from "mongoose";
interface Training {
    trainingId: string;
    name: string;
    completionDate?: Date;
    deadline?: Date;
    status?: "pending" | "completed" | "overdue";
    blockchainVerified?: boolean;
}

interface Milestone {
    id: string;
    description: string;
    timestamp?: Date;
    verified?: boolean;
    verifiedBy?: string;
    blockchainVerified?: boolean;
    blockNumber?: number;
}

export interface IEmployee extends Document {
    name: string;
    email: string;
    department: string;
    role: string;
    joinDate?: Date;
    isActive?: boolean;
    blockchainVerified?: boolean;
    blockchainHash?: string;
    trainings?: Training[];
    milestones?: Milestone[];
}

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    blockchainVerified: { type: Boolean, default: false },
    blockchainHash: { type: String, default: "" },
    trainings: [
        {
            trainingId: { type: String, required: true },
            name: String,
            completionDate: Date,
            deadline: Date,
            status: { type: String, enum: ["pending", "completed", "overdue"] },
            blockchainVerified: { type: Boolean, default: false },
        },
    ],
    milestones: [
        {
            id: String,
            description: String,
            timestamp: Date,
            verified: Boolean,
            verifiedBy: String,
            blockchainVerified: { type: Boolean, default: false },
            blockNumber: Number,
        },
    ],
});

export const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);
