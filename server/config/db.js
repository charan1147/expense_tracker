// Importing mongoose for MongoDB connection
import mongoose from "mongoose";

// Importing dotenv to load environment variables from a .env file
import dotenv from "dotenv";
dotenv.config(); // Loads environment variables (like MONGO_URI) from the .env file

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log a message
    console.log("MongoDB Connected");
  } catch (error) {
    // If there is an error, log the error message
    console.error("MongoDB Connection Error:", error.message);
    
    // Exit the process with a failure code (1) to indicate an error occurred
    process.exit(1);
  }
};

// Exporting the connectDB function so it can be used in other files
export default connectDB;
