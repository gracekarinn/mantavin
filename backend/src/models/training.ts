import mongoose from "mongoose";

const TrainingSchema = new mongoose.Schema({
    trainingId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    mandatory: { type: Boolean, default: false },
    department: [String],
    deadline: Date,
    materials: [
        {
            title: String,
            url: String,
        },
    ],
});

export const Training = mongoose.model("Training", TrainingSchema);
