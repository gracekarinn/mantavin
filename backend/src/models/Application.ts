import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    name: string;
    email: string;
    position: string;
    skills: string[];
    experience: number;
    cvHash: string;
    status: "pending" | "reviewing" | "accepted" | "rejected";
    expectedSalary: number;
    matchingScore?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema(
    {
        walletAddress: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        position: { type: String, required: true },
        skills: [{ type: String }],
        experience: { type: Number, required: true },
        cvHash: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "reviewing", "accepted", "rejected"],
            default: "pending",
        },
        expectedSalary: { type: Number, required: true },
        matchingScore: { type: Number },
    },
    { timestamps: true }
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
