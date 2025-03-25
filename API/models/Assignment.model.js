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
    submitFileTypes: { type: [String], default: [] },
    allowedMarks: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
    isLateSubmissionAllowed: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

assignmentSchema.pre("save", function () {
  if (this.isScheduled && !this.scheduledDateTime) {
    throw new Error("Scheduled date and time are required");
  }

  next();
});

const AssignmentModel = model("Assignment", assignmentSchema);

export default AssignmentModel;
