import { promisify } from "util";
import User from "../models/userModel.js";
import catchAsync from "../helpers/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../helpers/appError.js";

const newToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ------------------------------------------------------------------
// Create new User
export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone,
    address: req.body.address,
    role: User.role,
    answer: req.body.answer,
  });

  const token = newToken(newUser._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

// ------------------------------------------------------------------
// Login user
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // Check if the passowrd is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password!", 401));
  }

  // If everything ok, send token to the client
  const token = newToken(user._id);
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

// ------------------------------------------------------------------
// Check user is login
export const isLogin = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});

// ------------------------------------------------------------------
// Protect
export const protect = catchAsync(async (req, res, next) => {
  // Check if token is there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! please login to get accesss!", 401)
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // Check user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists!",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

// ------------------------------------------------------------------
// user Restriction
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    next();
  };
};

// ------------------------------------------------------------------
// Forgot password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email, answer, newPassword } = req.body;

  // check user exists or not.
  const user = await User.findOne({ email, answer });
  if (!user) {
    return new AppError("Invalid email or answer", 404);
  }

  // secure password
  const hashedNewPassword = await user.createNewPassword(newPassword);
  await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });

  res.status(200).json({
    status: "success",
    message: "Password reset successfully.",
  });
});

// ------------------------------------------------------------------
// User dashboard
export const userDashboard = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});

// ------------------------------------------------------------------
// Admin dashboard
export const adminDashboard = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});

// ------------------------------------------------------------------
// Update user Profile
export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email, password, address, phone } = req.body;
  const user = await User.findById(req.user._id);

  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    updateUser,
  });
});

export default {
  signup,
  login,
  isLogin,
  protect,
  restrictTo,
  userDashboard,
};
