"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
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
        const salt = await bcryptjs_1.default.genSalt(10);
        this.passwordHash = await bcryptjs_1.default.hash(this.passwordHash, salt);
    }
    catch (error) {
        throw new Error(`Password hashing failed: ${error.message}`);
    }
});
// 3. COMPILE THE MODEL *AFTER* ALL HOOKS ARE ATTACHED
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map