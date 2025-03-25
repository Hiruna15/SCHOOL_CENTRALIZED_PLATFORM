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
    isResubmit: {
      type: Boolean,
      default: false,
    },
    attachments: {
      type: [String],
      default: [],
    },
    marks: {
      type: Number,
      min: [0, "Marks cannot be less than 0"],
      validate: {
        validator: async function (value) {
          if (!this.assignment) return true;
          const Assignment = this.model("Assignment");
          const assignment = await Assignment.findById(this.assignment);
          return value <= assignment.allowedMarks;
        },
        message: "Marks cannot be more than allowed marks for this assignment",
      },
      default: 0,
    },
    isLateSubmission: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SubmissionModel = model("Submission", submissionSchema);

export default SubmissionModel;
