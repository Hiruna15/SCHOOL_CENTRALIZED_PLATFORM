import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubjectSchema = new Schema({
  name: {
    type: "String",
    required: [true, "Subject name is required"],
  },
});
