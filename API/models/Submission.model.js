import mongoose from "mongoose";

const { Schema, model } = mongoose;

const submissionSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    homework: {
      type: Schema.Types.ObjectId,
      ref: "Homework",
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
