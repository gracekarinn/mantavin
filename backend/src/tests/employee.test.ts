import request from "supertest";
import { app } from "./setup";
import { Employee } from "../models/employee";

describe("Employee API Tests", () => {
    beforeEach(async () => {
        await Employee.deleteMany({});
    });

    const mockEmployee = {
        name: "John Doe",
        email: "john@example.com",
        wallet: "0x1234567890abcdef",
        department: "Engineering",
        role: "Developer",
    };

    test("POST /api/employee/register creates new employee", async () => {
        const response = await request(app)
            .post("/api/employee/register")
            .send(mockEmployee);

        expect(response.status).toBe(201);
        expect(response.body.wallet).toBe(mockEmployee.wallet);
    });

    test("POST /api/employee/:wallet/milestone adds milestone", async () => {
        const employee = await Employee.create(mockEmployee);

        const response = await request(app)
            .post(`/api/employee/${employee.wallet}/milestone`)
            .send({ description: "Completed project" });

        expect(response.status).toBe(200);
        expect(response.body.milestones).toHaveLength(1);
    });

    test("PATCH /api/employee/:wallet/deactivate deactivates employee", async () => {
        const employee = await Employee.create(mockEmployee);

        const response = await request(app).patch(
            `/api/employee/${employee.wallet}/deactivate`
        );

        expect(response.status).toBe(200);
        expect(response.body.isActive).toBe(false);
    });
});
