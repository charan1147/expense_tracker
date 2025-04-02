import mongoose from "mongoose"; // Import Mongoose to define the schema and interact with MongoDB

// Define the Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    // The user who created the expense
    userId: { 
      type: mongoose.Schema.Types.ObjectId, // Stores a reference to the User model
      ref: "User", // Links to the "User" collection in MongoDB
      required: true // Ensures that an expense must be associated with a user
    },

    // The group where the expense belongs (null for personal expenses)
    groupId: { 
      type: mongoose.Schema.Types.ObjectId, // Stores a reference to the Group model
      ref: "Group" // Links to the "Group" collection in MongoDB
      // Not required because personal expenses may not have a group
    }, 

    // The amount spent in this expense
    amount: { 
      type: Number, // Stores the expense amount as a number
      required: true // Expense must have an amount
    },

    // The category of the expense (e.g., food, travel, bills)
    category: { 
      type: String, // Stores the category as a string
      required: true // Category is required for classification
    },

    // The date the expense occurred
    date: { 
      type: Date, // Stores the date as a JavaScript Date object
      required: true // The date must be provided
    },

    // An optional description for the expense
    description: String // A brief note about the expense (not required)
  },
  { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
  } 
);

// Export the Expense model for use in the application
export default mongoose.model("Expense", expenseSchema);
