import mongoose from "mongoose";

const { Schema, model } = mongoose;

const submissionSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
