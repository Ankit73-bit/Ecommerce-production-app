import AppError from "../helpers/appError.js";

// Error handling middleware
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// const handleDuplicateError = (err) => {
//   const value = err.errmsg.match(/\"(.*?)\"/)[1];
//   const message = `Duplicate field value ${value}. Please use another value!`;
//   return new AppError(message, 400);
// };

const handleJWTError = (err) =>
  new AppError("Invalid token. Please login again!", 401);

const handleTokenExpiredError = (err) =>
  new AppError("Your token has expired! Please login again.", 401);

const sendErrDev = (err, res) => {
  // It shows error, where it happens!
  // console.log(err.stack)

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  // if isOperational is true, then we send msg to the client.
  if (err.isOperational) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });

    // else we don't leak msg to the client (programming error)
  } else {
    // log error for devs
    console.error("Error: ", err);

    // sending generic msg
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.DEV_MODE === "development") {
    sendErrDev(err, res);
  } else if (process.env.DEV_MODE === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidatorError") error = handleValidationError(error);
    // if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleTokenExpiredError(error);

    sendErrProd(error, res);
  }
};
