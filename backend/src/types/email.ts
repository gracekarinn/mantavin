export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export interface EmailTemplate {
    subject: string;
    html: string;
}

export interface PendingTraining {
    name: string;
    deadline?: Date;
    daysUntilDeadline: number;
    trainingId: string;
    description?: string;
}

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
    cc?: string[];
    attachments?: Array<{
        filename: string;
        content: string | Buffer;
    }>;
}
