import mongoose from "mongoose";
import bycypt from "bcrypt";
import  Jwt  from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "password is required"],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    coverImg: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bycypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

// console.log(this.password);

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bycypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      // expiresIn: '90d'
    }
  );
};

userSchema.methods.generateReferenceToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFERENCE_TOKEN_SECRET,
    {
      // expiresIn: process.env.REFERENCE_TOKEN_EXPIRE,
      expiresIn: '90d'
    }
  );
};

export const User = mongoose.model("User", userSchema);
