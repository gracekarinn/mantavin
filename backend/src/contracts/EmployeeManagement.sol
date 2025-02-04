// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EmployeeManagement {
    struct Employee {
        address wallet;
        string profileHash;
        uint256 joinDate;
        bool isActive;
        mapping(bytes32 => bool) completedTrainings;
        uint256[] milestones;
    }

    struct Training {
        bytes32 id;
        string name;
        uint256 deadline;
        bool mandatory;
    }

    struct Milestone {
        uint256 id;
        string description;
        uint256 timestamp;
        bool verified;
    }

    mapping(address => Employee) public employees;
    mapping(uint256 => Milestone) public milestones;
    mapping(bytes32 => Training) public trainings;

    event EmployeeRegistered(address indexed wallet, string profileHash);
    event TrainingCompleted(address indexed employee, bytes32 trainingId);
    event MilestoneAchieved(address indexed employee, uint256 milestoneId);

    modifier onlyEmployee() {
        require(employees[msg.sender].isActive, "Not an active employee");
        _;
    }

    function registerEmployee(address _wallet, string memory _profileHash) external {
        require(!employees[_wallet].isActive, "Employee already exists");

        Employee storage newEmployee = employees[_wallet];
        newEmployee.wallet = _wallet;
        newEmployee.profileHash = _profileHash;
        newEmployee.joinDate = block.timestamp;
        newEmployee.isActive = true;

        emit EmployeeRegistered(_wallet, _profileHash);
    }

    function completeTraining(bytes32 _trainingId) external onlyEmployee {
        require(!employees[msg.sender].completedTrainings[_trainingId], "Training already completed");

        employees[msg.sender].completedTrainings[_trainingId] = true;
        emit TrainingCompleted(msg.sender, _trainingId);
    }

    function addMilestone(string memory _description) external onlyEmployee returns (uint256) {
        uint256 milestoneId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));

        Milestone storage newMilestone = milestones[milestoneId];
        newMilestone.id = milestoneId;
        newMilestone.description = _description;
        newMilestone.timestamp = block.timestamp;

        employees[msg.sender].milestones.push(milestoneId);

        emit MilestoneAchieved(msg.sender, milestoneId);
        return milestoneId;
    }
}
