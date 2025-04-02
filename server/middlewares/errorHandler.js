const errorHandler = (err, req, res, next) => {
  // Log the error message to the console with a timestamp
  console.error(`[${new Date().toISOString()}] ❌ Error: ${err.message}`);

  // Set the status code:
  // If the response status code is already set (>= 400), use it.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  // Send the error response as JSON
  res.status(statusCode).json({
    success: false, // Indicates failure
    message: err.message || "Something went wrong", // Send the error message or a generic fallback

    // If the app is running in "development" mode, include the stack trace for debugging.
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

// Export the error handler middleware for use in the application
export default errorHandler;
