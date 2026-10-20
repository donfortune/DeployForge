import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db"; // No extension needed

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(); // Call the function directly
    console.log("Database connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();