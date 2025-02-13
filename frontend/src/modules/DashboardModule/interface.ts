export interface Employee {
    id: string;
    _id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    overdueTrainings: number;
    milestones: number;
    blockchainVerified: boolean;
    isActive: boolean;
}

export interface CreateEmployeeDTO {
    name: string;
    email: string;
    department: string;
    role: string;
}

export interface EmployeeResponse {
    success: boolean;
    data?: Employee | Employee[];
    message?: string;
    transaction?: {
        hash: string;
        status: string;
    };
}
