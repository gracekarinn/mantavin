import dotenv from "dotenv";
import mongoose from "mongoose";
import { Employee } from "../models/employee";
import { Training } from "../models/training";

dotenv.config();

async function runMigrations() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connected for migration");

        await Employee.createCollection();
        await Training.createCollection();

        await Employee.collection.createIndex({ email: 1 }, { unique: true });
        await Training.collection.createIndex(
            { trainingId: 1 },
            { unique: true }
        );

        console.log("Migration complete");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

runMigrations();
