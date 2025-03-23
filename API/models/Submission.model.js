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
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["reviewed", "re-submit", "not-reviewed"],
        message: "{VALUE} is not supported",
      },
      default: "not-reviewed",
    },
    attachments: {
      type: [String],
      default: [],
    },
    marks: {
      type: Number,
      min: [0, "Marks cannot be less than 0"],
      max: [
        this.assignment.allowedMarks,
        "Marks cannot be more than allowed marks",
      ],
      default: 0,
    },
  },
  { timestamps: true }
);

const SubmissionModel = model("Submission", submissionSchema);

export default SubmissionModel;
