"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const userService_js_1 = require("../../services/userService.js");
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, userService_js_1.getAllUsers)();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to retrieve users at this time.'
        });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        // Pass the request body directly to the service
        const newUser = await (0, userService_js_1.createUser)(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    }
    catch (error) {
        console.error("Error in createUser controller:", error);
        // Handle duplicate email errors gracefully (both custom errors and MongoDB code 11000)
        if (error.message?.includes('already exists') || error.code === 11000) {
            res.status(400).json({ error: "A user with this email already exists" });
            return;
        }
        res.status(500).json({ error: "Failed to create user due to an internal error" });
    }
};
exports.createUser = createUser;
exports.default = {
    getAllUsers: exports.getAllUsers,
    createUser: exports.createUser
};
//# sourceMappingURL=userController.js.map