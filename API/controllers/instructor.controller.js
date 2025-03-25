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

const getAssignments = async (req, res, next) => {
  const {
    class: classId,
    subjects,
    isLocked,
    isScheduled,
    isActive,
    isOnlineSubmission,
    metDeadline,
  } = req.query;

  try {
    if (!classId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Class is required",
      });
    }

    const instructorDoc = await InstructorModel.findOne({
      _id: req.user._id,
      [`classesSubjectsMap.${classId}`]: { $exists: true },
    });

    if (!instructorDoc) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: "You don't have permission to view assignments for this class",
      });
    }

    const filterObject = {
      instructor: req.user._id,
      class: classId,
    };

    if (subjects) {
      const subjectIds = subjects.split(",").map((subject) => subject.trim());

      const instructorSubjects = instructorDoc.classesSubjectsMap.get(classId);
      const hasPermission = subjectIds.every((subject) =>
        instructorSubjects.includes(subject)
      );

      if (!hasPermission) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message:
            "You don't have permission to view assignments for one or more of the requested subjects",
        });
      }

      filterObject.subject = { $in: subjectIds };
    }

    const booleanFilters = {
      isLocked,
      isScheduled,
      isActive,
      isOnlineSubmission,
    };

    Object.entries(booleanFilters).forEach(([key, value]) => {
      if (value === "true" || value === "false") {
        filterObject[key] = value === "true";
      }
    });

    if (metDeadline === "true") {
      filterObject.dueDateTime = { $lte: new Date() };
    } else if (metDeadline === "false") {
      filterObject.dueDateTime = { $gt: new Date() };
    }

    const assignments = await AssignmentModel.find(filterObject);

    res.status(HttpStatus.OK).json({
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

export { createAssignment, getAssignments };
