import mongoose from "mongoose";

const { Schema, model } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: "String",
    required: [true, "Subject name is required"],
    trim: true,
  },
  code: { type: String, required: true, unique: true, trim: true },
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
});

const SubjectModel = model("Subject", subjectSchema);

export default SubjectModel;

//maths - one for each grade
//sinhala - one for each grade
//etc....
