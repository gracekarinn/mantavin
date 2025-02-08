import dotenv from "dotenv";
dotenv.config();

export const emailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
    },
};

export const emailTemplates = {
    trainingReminder: {
        subject: "Training Reminder: Action Required",
        generateHtml: (employeeName: string, trainings: any[]) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Training Reminder</h2>
                <p>Hello ${employeeName},</p>
                <p>This is a reminder that you have the following mandatory training(s) pending:</p>
                <ul>
                    ${trainings
                        .map(
                            (training) => `
                        <li style="margin-bottom: 10px;">
                            <strong>${training.name}</strong>
                            <br>Deadline: ${training.deadline?.toLocaleDateString()}
                            <br><span style="color: ${
                                training.daysUntilDeadline <= 3
                                    ? "red"
                                    : "orange"
                            }">
                                ${training.daysUntilDeadline} days remaining
                            </span>
                        </li>
                    `
                        )
                        .join("")}
                </ul>
                <p>Please complete these trainings as soon as possible to maintain compliance.</p>
                <p>Best regards,<br>HR Team</p>
            </div>
        `,
    },
};
