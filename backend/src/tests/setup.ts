import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "../index";
import { WebSocketProvider, Wallet, Contract } from "ethers";

dotenv.config({ path: ".env.test" });

const mockWebSocket = {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
};

jest.mock("ethers", () => ({
    WebSocketProvider: jest.fn().mockImplementation(() => ({
        websocket: mockWebSocket,
        getBlockNumber: jest.fn().mockResolvedValue(123456),
        getNetwork: jest.fn().mockResolvedValue({
            chainId: 5001,
            name: "mantaTestnet",
        }),
        destroy: jest.fn(),
    })),
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
        getBlockNumber: jest.fn().mockResolvedValue(123456),
        getNetwork: jest.fn().mockResolvedValue({
            chainId: 5001,
            name: "mantaTestnet",
        }),
    })),
    Contract: jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        removeAllListeners: jest.fn(),
        registerEmployee: jest
            .fn()
            .mockResolvedValue({ wait: () => Promise.resolve() }),
        createTraining: jest
            .fn()
            .mockResolvedValue({ wait: () => Promise.resolve() }),
        completeTraining: jest
            .fn()
            .mockResolvedValue({ wait: () => Promise.resolve() }),
        addMilestone: jest
            .fn()
            .mockResolvedValue({ wait: () => Promise.resolve() }),
        trainings: jest.fn().mockResolvedValue({
            id: "0x1234",
            name: "Test Training",
            deadline: 1735689600,
            mandatory: true,
        }),
    })),
    Wallet: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
    })),
    id: jest.fn().mockReturnValue("0x1234"),
}));

beforeAll(async () => {
    process.env.WS_URL = "ws://test.example.com";
    process.env.PRIVATE_KEY = "0x1234";
    process.env.CONTRACT_ADDRESS = "0x5678";
    await mongoose.connect(
        process.env.MONGODB_TEST_URI || "mongodb://localhost/test"
    );
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

export { app };
