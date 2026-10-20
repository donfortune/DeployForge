


import { z } from 'zod';

export const validateDeployment = z.object({
    repositoryUrl: z.string().url().refine((urlStr) => {
        try {
            const parsedUrl = new URL(urlStr);  
            return parsedUrl.hostname === 'github.com'; 
        } catch {
            return false;
        }
    }, {
        message: "Only official GitHub repositories (github.com) are allowed",
    }),
    
    
    branch: z.string()
        .transform((val) => val.trim())
        .pipe(z.string().min(1, "Branch name cannot be empty"))
});

export type CreateDeploymentInput = z.infer<typeof validateDeployment>;