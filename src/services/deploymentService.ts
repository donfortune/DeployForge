// import Deployment from "../persistence/models/deploymentModel"; 

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

import Deployment from "../persistence/models/deploymentModel"; 
// import validation from "../../src/validators/deploymentValidator"

export const getAllDeployments = async () => {
    try {
        const deployments = await Deployment.find(); 
        return deployments;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error fetching deployments:", message);
        throw new Error(`Failed to fetch deployments: ${message}`);
    }
};


export const createDeployment = async (deploymentData: any) => {
    try {
        const newDeployment = new Deployment(deploymentData);
        const savedDeployment = await newDeployment.save();
        return savedDeployment;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error creating deployment:", message);
        throw new Error(`Failed to create deployment: ${message}`);
    }
}


const allowedTransitions = {
    queued: ["building", "failed"],
    building: ["scanning", "failed"],
    scanning: ["deploying", "failed"],
    deploying: ["succeeded", "failed"],
    succeeded: [],
    failed: [],
} as const;

type DeploymentStatus = keyof typeof allowedTransitions;

export const updateDeploymentStatus = async (deploymentId: string, newStatus: DeploymentStatus) => {
    try {
        // 1. Fetch current document to check transition business logic
        const existingDeployment = await Deployment.findById(deploymentId);
        if (!existingDeployment) {
            throw new Error("Deployment not found");
        }

        const currentStatus = existingDeployment.status as DeploymentStatus; // set the type explicitly to match our allowedTransitions keys

        // 2. Validate structural transition rules
        const validNextStates: readonly DeploymentStatus[] = allowedTransitions[currentStatus] || [];
        if (!validNextStates.includes(newStatus)) {
            throw new Error(`Invalid status transition from '${currentStatus}' to '${newStatus}'`);
        }

        // 3. ATOMIC UPDATE: Query includes 'status: currentStatus' to prevent race conditions
        const updatedDeployment = await Deployment.findOneAndUpdate(
            { _id: deploymentId, status: currentStatus },
            { status: newStatus },
            { new: true, runValidators: true }
        );

        // If this is null, another concurrent request modified the status in the millisecond 
        // between our findById and findOneAndUpdate!
        if (!updatedDeployment) {
            throw new Error("Conflict: Deployment status was modified concurrently. Please retry.");
        }

        return updatedDeployment;

    } catch (error: unknown) {
        // 4. Strict TypeScript error narrowing (Point C)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error updating deployment status:", errorMessage);
        
        // Rethrow the exact error so the controller can handle custom messages (like 400 Bad Request)
        throw error;
    }
};