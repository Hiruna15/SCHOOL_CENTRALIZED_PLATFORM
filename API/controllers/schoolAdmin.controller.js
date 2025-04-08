import HttpStatus from "../constants/httpStatus.js";
import ClassModel from "../models/Class.model.js";
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

export { registerStudent };
