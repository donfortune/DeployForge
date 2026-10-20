"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_js_1 = __importDefault(require("./app.js"));
const db_1 = __importDefault(require("./config/db")); // No extension needed
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await (0, db_1.default)(); // Call the function directly
        console.log("Database connected...");
        app_js_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
startServer();
//# sourceMappingURL=server.js.map