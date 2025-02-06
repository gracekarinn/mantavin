import { ethers } from "hardhat";

async function main() {
    console.log("Starting deployment...");

    const EmployeeManagement = await ethers.getContractFactory(
        "EmployeeManagement"
    );
    console.log("Contract factory created");

    const employeeManagement = await EmployeeManagement.deploy({
        maxFeePerGas: ethers.parseUnits("2", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("1", "gwei"),
    });

    console.log(
        "Deployment transaction sent, hash:",
        employeeManagement.deploymentTransaction()?.hash
    );
    await employeeManagement.waitForDeployment();
    console.log(`Deployed to ${await employeeManagement.getAddress()}`);
}

main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
});
