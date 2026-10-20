import { Request, Response } from 'express';
import { getAllUsers as getUsers, createUser as registerUser } from '../../services/userService.js';

export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await getUsers();

        if (users.length === 0) {
            res.status(200).json({
                success: true,
                count: 0,
                data: [],
                message: 'No users have been created yet.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error: unknown) {
        res.status(500).json({
            success: false,
            message: 'Unable to retrieve users at this time.'
        });
    }
};




export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Pass the request body directly to the service
        const newUser = await registerUser(req.body);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    } catch (error: any) {
        console.error("Error in createUser controller:", error);

        // Handle duplicate email errors gracefully (both custom errors and MongoDB code 11000)
        if (error.message?.includes('already exists') || error.code === 11000) {
            res.status(400).json({ error: "A user with this email already exists" });
            return;
        }

        res.status(500).json({ error: "Failed to create user due to an internal error" });
    }
};

export default {
    getAllUsers,
    createUser
};