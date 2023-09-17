import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please tell us your name!"],
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide your email!"],
    },

    password: {
      type: String,
      required: [true, "Please provide a password!"],
      minlength: 8,
      select: false, // by selecting false we can't see password output
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the same!",
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    answer: {
      type: String,
      required: [true, "Please provide answer!"],
    },
    // passwordResetToken: String,
    // passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Securing the password before saving to the database
userSchema.pre("save", async function (next) {
  // Checks the password is modified or not
  if (!this.isModified("password")) return next();

  // secure the password
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Comparing the password for validation
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// securing new password
userSchema.methods.createNewPassword = async function (passowrd) {
  const newPassword = await bcrypt.hash(passowrd, 12);
  return newPassword;
};

// Creating new forgot password token
// userSchema.methods.correctPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

//   return resetToken;
// };

const User = mongoose.model("User", userSchema);
export default User;
