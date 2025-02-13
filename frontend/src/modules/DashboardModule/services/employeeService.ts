import { getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
    const token = getCookie("accessToken");
    if (!token) {
        console.error("Missing access token");
    }

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getEmployees = async () => {
    try {
        console.log("Fetching from:", `${API_URL}/api/employee`);
        console.log("Headers:", getHeaders());

        const response = await fetch(`${API_URL}/api/employee`, {
            headers: getHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                data: errorData,
            });
            throw new Error(errorData.message || "Failed to fetch employees");
        }

        const data = await response.json();
        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error("Error in getEmployees:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Error fetching employees",
        };
    }
};

export const createEmployee = async (data: any) => {
    try {
        const response = await fetch(`${API_URL}/api/employee`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                data: errorData,
            });
            throw new Error(errorData.message || "Failed to create employee");
        }

        const responseData = await response.json();
        return {
            success: true,
            data: responseData,
        };
    } catch (error) {
        console.error("Error in createEmployee:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Error creating employee",
        };
    }
};
