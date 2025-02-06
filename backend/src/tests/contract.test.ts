import { ContractService } from "../utils/contract";

describe("ContractService", () => {
    let contractService: ContractService;

    beforeEach(() => {
        contractService = new ContractService();
    });

    afterEach(() => {
        contractService.cleanup();
    });

    test("initializes with correct configuration", () => {
        expect(contractService.getContract()).toBeDefined();
    });

    test("handles event registration", async () => {
        const mockCallback = jest.fn();
        await contractService.setupEventListeners(mockCallback);

        const contract = contractService.getContract();
        expect(contract.on).toHaveBeenCalledTimes(4);
    });

    test("reconnects on websocket close", async () => {
        const ws = (contractService as any).provider.websocket;
        const closeHandler: (...args: any[]) => void = ws.on.mock.calls.find(
            (call: [string, (...args: any[]) => void]) => call[0] === "close"
        )[1];
        await closeHandler();
        expect(ws.on).toHaveBeenCalledWith("close", expect.any(Function));
    });
});
