// catchAsync function

export default (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// it will catch asynchronous error, as you know it returns promise,
// thats why we use .catch(next) to catch the error.
// next is globalErrorHandler for error message. You can see it in the ./controller/errorController.js
// All is left to use catchAsync function instead of try/catch.
// don't forgot to add 'next' parameter as it return err msg. ex: (req, res, next)
