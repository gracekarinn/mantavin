import request from "supertest";
import { app } from "./setup";
import { Training } from "../models/training";
import { ContractService } from "../utils/contract";

jest.mock("../utils/contract");

describe("Training API Tests", () => {
    beforeEach(async () => {
        await Training.deleteMany({});
    });

    const mockTraining = {
        trainingId: "TEST001",
        name: "Security Training",
        description: "Annual security awareness",
        deadline: new Date("2025-12-31"),
        mandatory: true,
        department: ["Engineering"],
    };

    test("POST /api/training creates new training", async () => {
        const response = await request(app)
            .post("/api/training")
            .send(mockTraining);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(mockTraining.name);
    });

    test("GET /api/chain-info returns network info", async () => {
        const response = await request(app).get("/api/chain-info");

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            blockNumber: 123456,
            chainId: 5001,
            name: "mantaTestnet",
        });
    });
});
