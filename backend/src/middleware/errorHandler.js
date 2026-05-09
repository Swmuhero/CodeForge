export function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    message: error.message || "Server error"
  };

  if (process.env.NODE_ENV !== "production" && error.details) {
    payload.details = error.details;
  }

  res.status(statusCode).json(payload);
}
