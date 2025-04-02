// Importing jsonwebtoken (JWT) for generating and verifying tokens
import jwt from "jsonwebtoken";

// Function to generate a JWT token and set it as an HTTP-only cookie
export const generateToken = (userId, res) => {
  // Ensure that JWT_SECRET is defined in the environment variables
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");

  // Create a JWT token with the user's ID as the payload
  const token = jwt.sign(
    { userId }, // Payload: contains the user ID
    process.env.JWT_SECRET, // Secret key for signing the token
    { expiresIn: "7d" } // Token expires in 7 days
  );

  // Set the JWT as an HTTP-only cookie in the response
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (converted to milliseconds)
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (security measure)
    sameSite: "strict", // Helps prevent CSRF attacks by ensuring the cookie is only sent with same-site requests
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
    domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined // Defines the domain in production
  });

  // Return the generated token for potential use in responses
  return token;
};

// Function to clear the JWT token by removing the cookie
export const clearToken = (res) => {
  res.clearCookie("jwt", {
    httpOnly: true, // Ensures cookie can't be accessed via JavaScript
    sameSite: "strict", // Protects against CSRF
    secure: process.env.NODE_ENV === "production" // Ensures HTTPS-only cookies in production
  });
};
