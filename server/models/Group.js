import mongoose from "mongoose"; // Import Mongoose to define the schema and interact with MongoDB

// Define the Group Schema
const groupSchema = new mongoose.Schema(
  {
    // Name of the group (e.g., "Friends Trip", "Family Expenses")
    name: { 
      type: String, // Stores the group name as a string
      required: true, // The group must have a name
      maxlength: 50 // Restricts the group name to a maximum of 50 characters
    },

    // Optional description of the group
    description: String, // Short info about the group (not required)

    // The user who created the group
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, // Stores a reference to the User model
      ref: "User", // Links to the "User" collection in MongoDB
      required: true // Ensures that a group must have a creator
    },

    // Members of the group (array of user IDs)
    members: [{ 
      type: mongoose.Schema.Types.ObjectId, // Stores references to User model
      ref: "User" // Links each member to a user in the "User" collection
    }],

    // Expenses associated with the group (array of expense IDs)
    expenses: [{ 
      type: mongoose.Schema.Types.ObjectId, // Stores references to Expense model
      ref: "Expense" // Links each expense to an entry in the "Expense" collection
    }]
  },
  { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Indexing for efficient queries (optimizes queries filtering by `createdBy`)
groupSchema.index({ createdBy: 1 });

// Export the Group model for use in the application
export default mongoose.model("Group", groupSchema);
