"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_js_1 = __importDefault(require("./presentation/middlewares/errorHandler.js"));
const deploymentRoutes_js_1 = __importDefault(require("./presentation/routes/v1/deploymentRoutes.js")); // Import the deployment routes
const userRoutes_js_1 = __importDefault(require("./presentation/routes/v1/userRoutes.js")); // Import the user routes
// (Note: depending on your tsconfig module settings, you may need .js or no extension)
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/deployments', deploymentRoutes_js_1.default); // Use the deployment routes
app.use('/api/v1/users', userRoutes_js_1.default); // Use the user routes
// Health Check Endpoint
app.get('/health', (request, res) => {
    res.status(200).json({ status: 'OK', message: 'Server running cleanly' });
});
// Dynamic / Versioned Routes Entry Point
// app.use('/api/v1/polls', pollRoutes);
// Global Error Handler Middleware
app.use(errorHandler_js_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map