import mongoose from "mongoose";

const { Schema, model } = mongoose;

const assignmentSchema = new Schema(
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
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    comments: { type: String, default: "" },
    isOnlineSubmission: {
      type: Boolean,
      default: false,
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    scheduledDateTime: { type: Date },
    dueDateTime: {
      type: Date,
      required: [true, "Due date and time are required"],
    },
    attachments: { type: [String], default: [] },
  },
  { timestamps: true }
);

const AssignmentModel = model("Assignment", assignmentSchema);

export default AssignmentModel;
