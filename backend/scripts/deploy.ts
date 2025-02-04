import { ethers } from "hardhat";

async function main() {
    const EmployeeManagement = await ethers.getContractFactory(
        "EmployeeManagement"
    );
    const employeeManagement = await EmployeeManagement.deploy();

    await employeeManagement.waitForDeployment();

    console.log(
        `EmployeeManagement deployed to ${await employeeManagement.getAddress()}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
