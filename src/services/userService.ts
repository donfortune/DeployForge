import User from '../persistence/models/userModel.js';

// export const getAllUsers = async () => {
//     try {
//         const users = await User.find() || [];
//         if (!users || users.length === 0 ) {
//             throw new Error("No users found");
//         }
//         return users;

//     } catch (error) {
//         console.error("Error fetching users:", error);
//         throw error;
//     }
// }

interface UserData {
    name: string;
    email: string;
    password: string;
}


export const getAllUsers = async () => {
    // exclude the passwordHash field from the returned user documents
    return await User.find().select('-passwordHash');
};


export const createUser = async (userData: any) => {
    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // 2. Map 'password' to 'passwordHash' so the pre-save bcrypt hook picks it up
        const user = new User({
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
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};