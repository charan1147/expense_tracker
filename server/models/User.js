import mongoose from "mongoose"; // Import Mongoose to define the schema
import bcrypt from "bcryptjs"; // Import bcrypt to hash and compare passwords

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    // Username (must be unique)
    username: { 
      type: String, // Store username as a string
      required: true, // Must be provided
      unique: true // Ensures no duplicate usernames exist
    },

    // Email (must be unique and stored in lowercase)
    email: { 
      type: String, // Store email as a string
      required: true, // Must be provided
      unique: true, // Ensures no duplicate emails exist
      lowercase: true // Converts the email to lowercase for consistency
    },

    // Password (must have a minimum length of 8 characters)
    password: { 
      type: String, // Store password as a string
      required: true, // Must be provided
      minlength: 8, // Ensures a minimum length of 8 characters
      select: false // Excludes password from queries by default (for security)
    }
  },
  { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Middleware: Hash password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, skip hashing
  this.password = await bcrypt.hash(this.password, 12); // Hash the password with a salt factor of 12
  next(); // Move to the next middleware or save function
});

// Method: Compare entered password with the stored (hashed) password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // Returns true if passwords match
};

// Export the User model for use in the application
export default mongoose.model("User", userSchema);
