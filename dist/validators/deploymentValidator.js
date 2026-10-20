"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeployment = void 0;
const zod_1 = require("zod");
exports.validateDeployment = zod_1.z.object({
    repositoryUrl: zod_1.z.string().url().refine((urlStr) => {
        try {
            const parsedUrl = new URL(urlStr);
            return parsedUrl.hostname === 'github.com';
        }
        catch {
            return false;
        }
    }, {
        message: "Only official GitHub repositories (github.com) are allowed",
    }),
    branch: zod_1.z.string()
        .transform((val) => val.trim())
        .pipe(zod_1.z.string().min(1, "Branch name cannot be empty"))
});
//# sourceMappingURL=deploymentValidator.js.map