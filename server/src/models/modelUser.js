import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { default_image_path } from "../scret.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is missing"],
      trim: true,
      minlength: [
        3,
        "The length name of User name can be minimum 31 character ",
      ],
      maxlength: [
        31,
        "The length name of User name can be 31 maximum character ",
      ],
    },
    email: {
      type: String,
      required: [true, "User email is missing"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "User password is missing"],
      minlength: [
        6,
        "The length name of User name can be minimum 31 character ",
      ],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: default_image_path,
    },
    address: {
      type: String,
      minlength: [
        3,
        "The length name of User address can be minimum 3 character ",
      ],
      required: [true, "User address is missing"],
    },
    phone: {
      type: String,
      required: [true, "User phone is missing"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestramps: true }
);

export default mongoose.model("User", userSchema);
