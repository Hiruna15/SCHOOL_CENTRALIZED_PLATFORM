import mongoose from "mongoose";

const { Schema, model } = mongoose;

const subjectSchema = new Schema({
  name: {
    type: "String",
    unique: true,
    required: [true, "Subject name is required"],
    trim: true,
    lowercase: true,
  },
  code: { type: String, required: true, unique: true, trim: true },
});

const SubjectModel = model("Subject", subjectSchema);

export default SubjectModel;
