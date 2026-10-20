"use strict";
// import Deployment from "../persistence/models/deploymentModel"; 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeploymentStatus = exports.createDeployment = exports.getAllDeployments = void 0;
// export const getAllDeployments = async () => {
//     try {
//         const deployments = await Deployment.find() || []; 
//         return deployments;
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : 'Unknown error';
//         console.error("Error fetching deployments:", message);
//         throw new Error(`Failed to fetch deployments: ${message}`);
//     }
// };
const deploymentModel_1 = __importDefault(require("../persistence/models/deploymentModel"));
// import validation from "../../src/validators/deploymentValidator"
const getAllDeployments = async () => {
    try {
        const deployments = await deploymentModel_1.default.find();
        return deployments;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error fetching deployments:", message);
        throw new Error(`Failed to fetch deployments: ${message}`);
    }
};
exports.getAllDeployments = getAllDeployments;
const createDeployment = async (deploymentData) => {
    try {
        const newDeployment = new deploymentModel_1.default(deploymentData);
        const savedDeployment = await newDeployment.save();
        return savedDeployment;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error creating deployment:", message);
        throw new Error(`Failed to create deployment: ${message}`);
    }
};
exports.createDeployment = createDeployment;
const allowedTransitions = {
    queued: ["building", "failed"],
    building: ["scanning", "failed"],
    scanning: ["deploying", "failed"],
    deploying: ["succeeded", "failed"],
    succeeded: [],
    failed: [],
};
const updateDeploymentStatus = async (deploymentId, newStatus) => {
    try {
        // 1. Fetch current document to check transition business logic
        const existingDeployment = await deploymentModel_1.default.findById(deploymentId);
        if (!existingDeployment) {
            throw new Error("Deployment not found");
        }
        const currentStatus = existingDeployment.status; // set the type explicitly to match our allowedTransitions keys
        // 2. Validate structural transition rules
        const validNextStates = allowedTransitions[currentStatus] || [];
        if (!validNextStates.includes(newStatus)) {
            throw new Error(`Invalid status transition from '${currentStatus}' to '${newStatus}'`);
        }
        // 3. ATOMIC UPDATE: Query includes 'status: currentStatus' to prevent race conditions
        const updatedDeployment = await deploymentModel_1.default.findOneAndUpdate({ _id: deploymentId, status: currentStatus }, { status: newStatus }, { new: true, runValidators: true });
        // If this is null, another concurrent request modified the status in the millisecond 
        // between our findById and findOneAndUpdate!
        if (!updatedDeployment) {
            throw new Error("Conflict: Deployment status was modified concurrently. Please retry.");
        }
        return updatedDeployment;
    }
    catch (error) {
        // 4. Strict TypeScript error narrowing (Point C)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error updating deployment status:", errorMessage);
        // Rethrow the exact error so the controller can handle custom messages (like 400 Bad Request)
        throw error;
    }
};
exports.updateDeploymentStatus = updateDeploymentStatus;
//# sourceMappingURL=deploymentService.js.map