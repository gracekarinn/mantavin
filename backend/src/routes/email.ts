import express, { Request, Response, Router, RequestHandler } from "express";
import { Employee } from "../models/employee";
import { reminderService } from "../services/reminder";

const router: Router = express.Router();

interface ReminderParams {
    employeeId: string;
}

const sendReminder: RequestHandler<ReminderParams> = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        await reminderService.processEmployeeReminders(employee);
        res.json({ message: "Reminder sent successfully" });
    } catch (error) {
        console.error("Error sending reminder:", error);
        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to send reminder",
        });
    }
};

router.post("/send-reminder/:employeeId", sendReminder);

export { router };
