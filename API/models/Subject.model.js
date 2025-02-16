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

subjectSchema.pre("save", async function (next) {
  if (!this.isModified("classes") && !this.isModified("name")) {
    return next();
  }

  const SubjectModel = mongoose.model("Subject");

  const existingSubjects = await SubjectModel.find({ name: this.name });

  if (existingSubjects.length > 0) {
    const existingClasses = new Set(
      existingSubjects.flatMap((subject) =>
        subject.classes.map((classId) => classId.toString())
      )
    );

    const hasOverlap = this.classes.some((classId) =>
      existingClasses.has(classId.toString())
    );

    if (hasOverlap) {
      return next(
        new Error(
          `A subject with the name '${this.name}' already exists for the same class. Subjects with the same name must have unique classes.`
        )
      );
    }
  }

  next();
});

const SubjectModel = model("Subject", subjectSchema);

export default SubjectModel;

//maths - one for each grade
//sinhala - one for each grade
//etc....
