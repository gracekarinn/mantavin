import mongoose, { Document } from "mongoose";

export interface ITraining extends Document {
    trainingId: string;
    name: string;
    description?: string;
    mandatory: boolean;
    department: string[];
    deadline: Date;
    blockchainVerified?: boolean;
    materials?: Array<{
        title: string;
        url: string;
    }>;
}

const TrainingSchema = new mongoose.Schema({
    trainingId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    mandatory: { type: Boolean, default: false },
    department: [String],
    deadline: Date,
    blockchainVerified: { type: Boolean, default: false },
    materials: [
        {
            title: String,
            url: String,
        },
    ],
});

export const Training = mongoose.model<ITraining>("Training", TrainingSchema);
