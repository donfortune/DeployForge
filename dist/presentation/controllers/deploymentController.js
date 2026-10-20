"use strict";
// import { getAllDeployments } from '/Users/i/deployForge/src/services/deploymentService';
// import { Request as req, Response as res } from 'express';
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.createDeployment = exports.getAllDeployments = void 0;
// export const getAllDeployments = async (request: req, response: res) => {
//     try {
//         const deployments = await getAllDeployment.getAllDeployments();
//         response.status(200).json(deployments);
//     } catch (error) {
//         console.error("Error fetching deployments:", error);
//         response.status(500).json({ error: "Failed to fetch deployments" });
//     }   
// }
const deploymentService_js_1 = require("../../services/deploymentService.js");
const deploymentService_js_2 = require("../../services/deploymentService.js");
const deploymentValidator_js_1 = require("../../validators/deploymentValidator.js");
const deploymentService_js_3 = require("../../services/deploymentService.js");
const getAllDeployments = async (req, res) => {
    try {
        const deployments = await (0, deploymentService_js_1.getAllDeployments)();
        res.status(200).json(deployments);
    }
    catch (error) {
        console.error("Error fetching deployments:", error);
        res.status(500).json({ error: "Failed to fetch deployments" });
    }
};
exports.getAllDeployments = getAllDeployments;
const createDeployment = async (req, res) => {
    try {
        // 1. Validate incoming request body against your Zod schema safely
        const validationResult = deploymentValidator_js_1.validateDeployment.safeParse(req.body);
        if (!validationResult.success) {
            // If validation fails, return a 400 status with the Zod error messages
            res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.format()
            });
            return;
        }
        // 2. Use the safely validated and typed data
        const validatedData = validationResult.data;
        // 3. Call the service to save to MongoDB
        const newDeployment = await (0, deploymentService_js_2.createDeployment)(validatedData);
        res.status(201).json(newDeployment);
    }
    catch (error) {
        console.error("Error creating deployment:", error);
        res.status(500).json({ error: "Failed to create deployment" });
    }
};
exports.createDeployment = createDeployment;
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ error: "New status is required in the request body" });
            return;
        }
        // Call our atomic service function
        const updatedDeployment = await (0, deploymentService_js_3.updateDeploymentStatus)(id, status);
        res.status(200).json({
            success: true,
            message: "Deployment status updated successfully",
            data: updatedDeployment
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error in updateStatus controller:", errorMessage);
        // 1. Not Found error
        if (errorMessage.includes("Deployment not found")) {
            res.status(404).json({ error: errorMessage });
            return;
        }
        // 2. Bad Request: Invalid transition or concurrent race condition conflict
        if (errorMessage.includes("Invalid status transition") || errorMessage.includes("Conflict:")) {
            res.status(400).json({ error: errorMessage });
            return;
        }
        // 3. Fallback for unexpected system errors
        res.status(500).json({ error: "Internal server error while updating deployment status" });
    }
};
exports.updateStatus = updateStatus;
exports.default = {
    getAllDeployments: exports.getAllDeployments,
    createDeployment: exports.createDeployment,
    updateStatus: exports.updateStatus
};
//# sourceMappingURL=deploymentController.js.map