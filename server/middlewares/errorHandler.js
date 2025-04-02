const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ Error: ${err.message}`);

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Show stack trace in development mode
  });
};

export default errorHandler;
