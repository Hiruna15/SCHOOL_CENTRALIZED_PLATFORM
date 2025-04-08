import HttpStatus from "../constants/httpStatus.js";
import ClassModel from "../models/Class.model.js";
import InstructorModel from "../models/Instructor.model.js";
import StudentModel from "../models/Student.model.js";

const registerStudent = async (req, res, next) => {
  try {
    const adminsSchool = req.user.schoolId;

    const isCorrectClass = !!(await ClassModel.findOne({
      _id: req.body.class,
      schoolId: adminsSchool,
    }));

    if (!isCorrectClass) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Invalid class ID or class does not belong to your school",
      });
    }

    if (adminsSchool !== req.body.schoolId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "School ID does not match your school",
      });
    }

    const existingStudent = await StudentModel.findOne({
      email: req.body.email,
    });
    if (existingStudent) {
      return res.status(HttpStatus.CONFLICT).json({
        message: "A student with this email already exists",
      });
    }

    const student = await StudentModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
};

const registerInstructor = async (req, res, next) => {
  try {
    const adminsSchool = req.user.schoolId;
    const { classesSubjectsMap, username, email, schoolId } = req.body;

    if (adminsSchool !== schoolId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "School ID does not match your school",
      });
    }

    const existingInstructor = await InstructorModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingInstructor) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Username or email already exists",
      });
    }

    if (
      !classesSubjectsMap ||
      typeof classesSubjectsMap !== "object" ||
      Object.keys(classesSubjectsMap).length === 0
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:
          "Instructor should be given access to at least one class and its subjects",
      });
    }

    for (const [classId, subjects] of Object.entries(classesSubjectsMap)) {
      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Each class must have at least one subject assigned",
        });
      }

      const classDoc = await ClassModel.findOne({
        _id: classId,
        schoolId: adminsSchool,
      });

      if (!classDoc) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "No class found with that id in the school",
        });
      }

      const classSubjects = classDoc.subjects;
      const invalidSubjects = subjects.filter(
        (subject) => !classSubjects.includes(subject)
      );

      if (invalidSubjects.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Some subjects are not relevant to the class",
          invalidSubjects,
        });
      }
    }

    const instructor = await InstructorModel.create(req.body);

    res.status(HttpStatus.CREATED).json({
      message: "Instructor registered successfully",
      instructor,
    });
  } catch (error) {
    next(error);
  }
};

export { registerStudent, registerInstructor };
