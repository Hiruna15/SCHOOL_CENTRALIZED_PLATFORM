import mongoose from "mongoose";
import { applyPasswordValidatingAndHashing } from "../utils/hashUtils.js";

const { Schema, model } = mongoose;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const schoolAdminSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exist"],
    trim: true,
    match: [emailRegex, "Invalid email address"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username is already taken"],
    trim: true,
  },
  hash: {
    type: String,
    required: [true, "password must be provided"],
  },
  salt: {
    type: String,
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    required: [true, "an admin should be assigned to a school"],
  },
  userType: {
    type: String,
    default: "schoolAdmin",
  },
});

applyPasswordValidatingAndHashing(schoolAdminSchema);

const SchoolAdminModel = model("SchoolAdmin", schoolAdminSchema);

export default SchoolAdminModel;
