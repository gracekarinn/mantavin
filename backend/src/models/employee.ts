import mongoose, { Document } from "mongoose";

interface Training {
    trainingId: string;
    name: string;
    completionDate?: Date;
    deadline?: Date;
    status?: "pending" | "completed" | "overdue";
}

interface Milestone {
    id: string;
    description: string;
    timestamp?: Date;
    verified?: boolean;
    verifiedBy?: string;
}

export interface IEmployee extends Document {
    wallet: string;
    name: string;
    email: string;
    department: string;
    role: string;
    joinDate?: Date;
    isActive?: boolean;
    trainings?: Training[];
    milestones?: Milestone[];
}

const EmployeeSchema = new mongoose.Schema({
    wallet: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    trainings: [
        {
            trainingId: String,
            name: String,
            completionDate: Date,
            deadline: Date,
            status: { type: String, enum: ["pending", "completed", "overdue"] },
        },
    ],
    milestones: [
        {
            id: String,
            description: String,
            timestamp: Date,
            verified: Boolean,
            verifiedBy: String,
        },
    ],
});

export const Employee = mongoose.model("Employee", EmployeeSchema);
