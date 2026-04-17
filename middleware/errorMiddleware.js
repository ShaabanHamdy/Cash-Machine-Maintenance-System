
// Middleware to catch 404 Not Found routes
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler to catch all errors from routes
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        // Only show stack trace in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

