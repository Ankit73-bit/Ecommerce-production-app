// Operational Error

class AppError extends Error {
  constructor(message, statusCode) {
    // Parent class is error
    // whatever we passed into it will be message property
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
