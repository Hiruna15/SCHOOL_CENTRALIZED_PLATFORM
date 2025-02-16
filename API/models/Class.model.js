import mongoose from "mongoose";

const { Schema, model } = mongoose;

const classSchema = new Schema({
  className: {
    type: String,
    required: true,
    trim: true,
  }, // A
  grade: {
    type: String,
    required: [true, "Grade level is required"],
  },
  subjects: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one subject must be added",
    },
  },
  students: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    default: [],
  },
  instructors: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
      },
    ],
    default: [],
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  schedule: {
    type: Map,
    of: [
      {
        subject: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    default: {},
  },
});

const ClassModel = model("Class", classSchema);

export default ClassModel;
