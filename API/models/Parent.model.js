import mongoose from "mongoose";
import { applyPasswordValidatingAndHashing } from "../utils/hashUtils.js";

const { Schema, model } = mongoose;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const parentSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "this username is already taken"],
    maxLength: [20, "username cannot have more than 20 characters"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    unique: [
      true,
      "An account has been already registered with the email you provided",
    ],
    match: [emailRegex, "Invalid email address"],
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    required: [true, "school id should be provided"],
  },
  mobile: {
    type: [String],
    required: [true, "Mobile number should be provided"],
  },
  students: {
    type: [Schema.Types.ObjectId],
    required: [true, "student ids are not provided"],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one student id must be provided",
    },
  },
  hash: {
    type: String,
    required: [true, "Password must be provided"],
  },
  salt: {
    type: String,
  },
  userType: {
    type: String,
    default: "parent",
  },
});

applyPasswordValidatingAndHashing(parentSchema);

const ParentModel = model("Parent", parentSchema);

export default ParentModel;
