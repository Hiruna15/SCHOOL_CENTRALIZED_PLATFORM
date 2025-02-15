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
  classes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one class must be provided",
    },
  },
  subjects: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
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

instructorSchema.pre("save", async function (next) {
  if (!this.isModified("subjects") && !this.isModified("classes")) {
    return next();
  }

  const SubjectModel = mongoose.model("Subject");

  const subjects = await SubjectModel.find({ _id: { $in: this.subjects } });

  if (!subjects.length) {
    return next(new Error("At least one subject must be assigned"));
  }

  const subjectClasses = new Set();
  subjects.forEach((subject) => {
    subject.classes.forEach((classId) =>
      subjectClasses.add(classId.toString())
    );
  });

  // Ensure every assigned class is covered by at least one subject
  const missingClasses = this.classes.filter(
    (classId) => !subjectClasses.has(classId.toString())
  );

  if (missingClasses.length > 0) {
    return next(
      new Error(
        `Instructor should have assigned to at least one subject from each class that he has assigned.`
      )
    );
  }

  next();
});

applyPasswordValidatingAndHashing(instructorSchema);

const InstructorModel = model("Instructor", instructorSchema);

export default InstructorModel;
