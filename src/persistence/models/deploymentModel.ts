// import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';


// export interface IDeployment extends Document {
//     repositoryUrl: string;
//     branch: string;
//     status: 'queued' | 'building' | 'scanning' | 'deploying' | 'succeeded' | 'failed';
//     failureReason?: string;
//     createdAt: Date;
//     updatedAt: Date;
// }



// const deploymentSchema = new Schema<IDeployment>({
//     repositoryUrl: { type: String, required: true },
//     branch: { type: String, required: true },
//     status: { 
//         type: String, 
//         required: true, 
//         enum: ['queued', 'building', 'scanning', 'deploying', 'succeeded', 'failed'], // Ensures MongoDB matches your TS types!
//         default: 'queued' 
//     },
//     failureReason: { type: String }

// }, { 
//     timestamps: true 
// });




// const Deployment = mongoose.model<IDeployment>('Deployment', deploymentSchema);

// export default Deployment;


import mongoose, { Schema } from 'mongoose';

const deploymentSchema = new Schema(
    {
        repositoryUrl: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                'queued',
                'building',
                'scanning',
                'deploying',
                'succeeded',
                'failed',
            ],
            default: 'queued',
            required: true,
        },
        failureReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export type DeploymentDocument = mongoose.InferSchemaType<typeof deploymentSchema>;

const Deployment = mongoose.model(
    'Deployment',
    deploymentSchema
);

export default Deployment;