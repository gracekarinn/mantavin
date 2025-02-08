import nodemailer from "nodemailer";
import { EmailConfig, EmailOptions } from "../types/email";

class MailerService {
    private transporter: nodemailer.Transporter;
    private readonly fromEmail: string;

    constructor(config: EmailConfig) {
        this.transporter = nodemailer.createTransport(config);
        this.fromEmail = config.auth.user;
    }

    async sendMail(options: EmailOptions): Promise<boolean> {
        try {
            const mailOptions = {
                ...options,
                from: options.from || this.fromEmail,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", info.messageId);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log("SMTP connection verified successfully");
            return true;
        } catch (error) {
            console.error("SMTP connection verification failed:", error);
            return false;
        }
    }
}

let mailerInstance: MailerService | null = null;

export const createMailer = (config: EmailConfig): MailerService => {
    if (!mailerInstance) {
        mailerInstance = new MailerService(config);
    }
    return mailerInstance;
};

export const getMailer = (): MailerService | null => mailerInstance;
