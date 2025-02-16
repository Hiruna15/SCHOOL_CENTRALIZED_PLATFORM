import mongoose from "mongoose";
import { applyPasswordValidatingAndHashing } from "../utils/hashUtils.js";

const { Schema, model } = mongoose;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const instructorSchema = new Schema({
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
  birthday: {
    type: Date,
    required: [true, "Birthday should be provided"],
  },
  gender: {
    type: String,
    required: [true, "Gender is not specified"],
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: [true, "school id should be provided"],
  },
  classesSubjectsMap: {
    type: Map,
    of: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    validate: {
      validator: function (map) {
        return Array.from(map.values()).every(
          (subjects) => subjects.length > 0
        );
      },
      message:
        "Instructor should have assess to at least one subject from each class that he is assigned to",
    },
  },
  mobile: {
    type: [String],
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
    default: "instructor",
  },
});

applyPasswordValidatingAndHashing(instructorSchema);

const InstructorModel = model("Instructor", instructorSchema);

export default InstructorModel;
