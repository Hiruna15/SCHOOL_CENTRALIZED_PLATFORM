import mongoose from "mongoose";
import { applyPasswordValidatingAndHashing } from "../utils/hashUtils.js";

const { Schema, model } = mongoose;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const studentSchema = new Schema({
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
  grade: {
    type: String,
    required: [true, "Student should be assigned a grade"],
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Student should be assigned to a class"],
  },
  entryNumber: {
    type: String,
    required: [true, "entry number of the student should be provided"],
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
  hash: {
    type: String,
    required: [true, "Password must be provided"],
  },
  salt: {
    type: String,
  },
  userType: {
    type: String,
    default: "student",
  },
});

applyPasswordValidatingAndHashing(studentSchema);

const StudentModel = model("Student", studentSchema);

export default StudentModel;
