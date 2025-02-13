import mongoose from "mongoose";

const { Schema, model } = mongoose;

const homeWorkSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    //   subject
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    class: {
      type: String,
      required: [true, "Class must be specified"],
      trim: true,
    },
    isOnlineSubmission: {
      type: Boolean,
      default: false,
    },
    dueDateTime: {
      type: Date,
      required: [true, "Due date and time are required"],
    },
    attachments: { type: [String], default: [] },
  },
  { timestamps: true }
);
