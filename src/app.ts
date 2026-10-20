import express, { Request, Response } from 'express';
import cors from 'cors';
import errorHandler from './presentation/middlewares/errorHandler.js'; 
import deploymentRoutes from './presentation/routes/v1/deploymentRoutes.js'; // Import the deployment routes
import userRoutes from './presentation/routes/v1/userRoutes.js'; // Import the user routes
// (Note: depending on your tsconfig module settings, you may need .js or no extension)

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/v1/deployments', deploymentRoutes); // Use the deployment routes
app.use('/api/v1/users', userRoutes); // Use the user routes

// Health Check Endpoint
app.get('/health', (request: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server running cleanly' });
});

// Dynamic / Versioned Routes Entry Point
// app.use('/api/v1/polls', pollRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;