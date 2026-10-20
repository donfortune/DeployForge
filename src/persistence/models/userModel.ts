import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true, default: 'user' },
    isActive: { type: Boolean, required: true, default: true },
    emailVerifiedAt: { type: Date, default: null },
}, { timestamps: true });

// 1. DEFINE HOOKS *BEFORE* COMPILING THE MODEL
userSchema.pre('save', async function () {
    // 'this' refers to the user document being saved
    if (!this.isModified('passwordHash')) {
        return;
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    } catch (error: any) {
        throw new Error(`Password hashing failed: ${error.message}`);
    }
});

// 2. Export the inferred type (PascalCase is standard for types)
export type UserDocument = mongoose.InferSchemaType<typeof userSchema>;

// 3. COMPILE THE MODEL *AFTER* ALL HOOKS ARE ATTACHED
const User = mongoose.model('User', userSchema);

export default User;