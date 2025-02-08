import cron from "node-cron";
import { Employee, IEmployee } from "../models/employee";
import { Training } from "../models/training";
import { createMailer } from "../utils/mailer";
import { emailConfig, emailTemplates } from "../config/email";
import { PendingTraining } from "../types/email";

export class TrainingReminderService {
    private readonly mailer;
    private isRunning: boolean = false;
    private cronJob: cron.ScheduledTask | null = null;

    constructor() {
        this.mailer = createMailer(emailConfig);
    }

    async start(cronExpression: string = "0 9 * * *"): Promise<void> {
        if (this.isRunning) {
            console.log("Reminder service is already running");
            return;
        }

        try {
            await this.mailer.verifyConnection();
            this.scheduleCronJob(cronExpression);
            this.isRunning = true;
            console.log("Training reminder service started successfully");
        } catch (error) {
            console.error("Failed to start reminder service:", error);
            throw error;
        }
    }

    stop(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            this.isRunning = false;
            console.log("Training reminder service stopped");
        }
    }

    private scheduleCronJob(cronExpression: string): void {
        this.cronJob = cron.schedule(cronExpression, () => {
            this.checkAllEmployees().catch((error) =>
                console.error("Error in reminder cron job:", error)
            );
        });
    }

    async checkAllEmployees(): Promise<void> {
        try {
            const employees = await Employee.find({ isActive: true });

            for (const employee of employees) {
                await this.processEmployeeReminders(employee);
            }
        } catch (error) {
            console.error("Error processing reminders:", error);
            throw error;
        }
    }

    async processEmployeeReminders(employee: IEmployee): Promise<void> {
        try {
            const pendingTrainings = await this.getPendingTrainings(employee);

            if (pendingTrainings.length > 0) {
                await this.sendReminderEmail(employee, pendingTrainings);
            }
        } catch (error) {
            console.error(
                `Error processing reminders for employee ${employee.email}:`,
                error
            );
            throw error;
        }
    }

    async getPendingTrainings(employee: IEmployee): Promise<PendingTraining[]> {
        const pendingTrainings: PendingTraining[] = [];
        const currentDate = new Date();

        for (const training of employee.trainings || []) {
            if (training.status === "pending" && training.deadline) {
                const trainingDetails = await Training.findOne({
                    trainingId: training.trainingId,
                });

                if (trainingDetails?.mandatory) {
                    const daysUntilDeadline = Math.ceil(
                        (training.deadline.getTime() - currentDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                    );

                    if (daysUntilDeadline <= 7) {
                        pendingTrainings.push({
                            name: trainingDetails.name,
                            deadline: training.deadline,
                            daysUntilDeadline,
                            trainingId: training.trainingId,
                            description: trainingDetails.description,
                        });
                    }
                }
            }
        }

        return pendingTrainings;
    }

    private async sendReminderEmail(
        employee: IEmployee,
        pendingTrainings: PendingTraining[]
    ): Promise<void> {
        const html = emailTemplates.trainingReminder.generateHtml(
            employee.name,
            pendingTrainings
        );

        const success = await this.mailer.sendMail({
            to: employee.email,
            subject: emailTemplates.trainingReminder.subject,
            html,
        });

        if (!success) {
            throw new Error(`Failed to send reminder to ${employee.email}`);
        }
    }
}

export const reminderService = new TrainingReminderService();
