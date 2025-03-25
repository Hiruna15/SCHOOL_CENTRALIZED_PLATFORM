import HttpStatus from "../constants/httpStatus.js";
import AssignmentModel from "../models/Assignment.model.js";
import InstructorModel from "../models/Instructor.model.js";

const createAssignment = async (req, res, next) => {
  try {
    const {
      class: classId,
      subject,
      dueDateTime,
      isScheduled,
      scheduledDateTime,
    } = req.body;
    const instructor = req.user._id;

    if (new Date(dueDateTime) <= new Date()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Due date must be in the future",
      });
    }

    if (
      isScheduled &&
      (!scheduledDateTime || new Date(scheduledDateTime) <= new Date())
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Scheduled date must be in the future",
      });
    }

    const instructorDoc = await InstructorModel.findOne({
      _id: instructor,
      [`classesSubjectsMap.${classId}`]: { $exists: true },
    });

    if (!instructorDoc) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message:
          "You don't have permission to create assignments for this class",
      });
    }

    if (!instructorDoc.classesSubjectsMap.get(classId).includes(subject)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message:
          "You don't have permission to create assignments for this subject in this class",
      });
    }

    const assignment = await AssignmentModel.create({
      ...req.body,
      instructor,
    });

    res.status(HttpStatus.CREATED).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

export { createAssignment };
