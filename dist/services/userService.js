"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const userModel_js_1 = __importDefault(require("../persistence/models/userModel.js"));
const getAllUsers = async () => {
    // exclude the passwordHash field from the returned user documents
    return await userModel_js_1.default.find().select('-passwordHash');
};
exports.getAllUsers = getAllUsers;
const createUser = async (userData) => {
    try {
        // 1. Check if user already exists
        const existingUser = await userModel_js_1.default.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // 2. Map 'password' to 'passwordHash' so the pre-save bcrypt hook picks it up
        const user = new userModel_js_1.default({
            name: userData.name,
            email: userData.email,
            passwordHash: userData.password, // Triggers your bcrypt hash hook
            role: userData.role || 'user'
        });
        const savedUser = await user.save();
        // 3. Convert to object and strip the passwordHash before returning to the controller
        const userObj = savedUser.toObject();
        const { passwordHash, ...userWithoutPassword } = userObj;
        return userWithoutPassword;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
exports.createUser = createUser;
//# sourceMappingURL=userService.js.map