
// import { getAllDeployments } from '/Users/i/deployForge/src/services/deploymentService';
// import { Request as req, Response as res } from 'express';

// export const getAllDeployments = async (request: req, response: res) => {
//     try {
//         const deployments = await getAllDeployment.getAllDeployments();
//         response.status(200).json(deployments);
//     } catch (error) {
//         console.error("Error fetching deployments:", error);
//         response.status(500).json({ error: "Failed to fetch deployments" });
//     }   
// }

import { getAllDeployments as fetchDeployments } from '../../services/deploymentService.js';
import { Request, Response } from 'express';
import { createDeployment as createDeploymentService } from '../../services/deploymentService.js';
import { validateDeployment } from '../../validators/deploymentValidator.js';
import { updateDeploymentStatus } from '../../services/deploymentService.js';

export const getAllDeployments = async (req: Request, res: Response): Promise<void> => {
    try {
        const deployments = await fetchDeployments();
        res.status(200).json(deployments);
    } catch (error) {
        console.error("Error fetching deployments:", error);
        res.status(500).json({ error: "Failed to fetch deployments" });
    }   
};


export const createDeployment = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Validate incoming request body against your Zod schema safely
        const validationResult = validateDeployment.safeParse(req.body);

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
        const newDeployment = await createDeploymentService(validatedData);
        
        res.status(201).json(newDeployment);
    } catch (error) {
        console.error("Error creating deployment:", error);
        res.status(500).json({ error: "Failed to create deployment" });
    }
};


export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            res.status(400).json({ error: "New status is required in the request body" });
            return;
        }

        // Call our atomic service function
        const updatedDeployment = await updateDeploymentStatus(id as string, status);

        res.status(200).json({
            success: true,
            message: "Deployment status updated successfully",
            data: updatedDeployment
        });

    } catch (error: unknown) {
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

export default {
    getAllDeployments,
    createDeployment,
    updateStatus
};