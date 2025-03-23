import HttpStatus from "../constants/httpStatus.js";
import AssignmentModel from "../models/Assignment.model.js";
import SubmissionModel from "../models/Submission.model.js";

const filterAssignments = async (req, res, next) => {
  const { classId, subjectIds, isActive } = req.query;

  const filterObject = {};

  if (classId) {
    filterObject.class = classId;
  } else {
    return next(new Error("Class ID is required"));
  }

  if (typeof isActive !== "undefined") {
    filterObject.isActive = isActive === "true";
  }

  if (subjectIds) {
    const subjects = Array.isArray(subjectIds) ? subjectIds : [subjectIds];
    filterObject.subject = { $in: subjects };
  }

  try {
    const assignments = await AssignmentModel.find(filterObject);
    res.status(HttpStatus.OK).json({
      message: "Assignments filtered successfully",
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

const submitAssignment = async (req, res, next) => {
  try {
    const { assignment, attachments } = req.body;
    const student = req.user._id;

    const assignmentDoc = await AssignmentModel.findOne({
      _id: assignment,
      isActive: true,
    });

    if (!assignmentDoc) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Assignment not found or is not active",
      });
    }

    if (new Date() > assignmentDoc.dueDateTime) {
      req.body.isLateSubmission = true;
    }

    const existingSubmission = await SubmissionModel.findOne({
      student,
      assignment,
    });

    if (existingSubmission) {
      return res.status(HttpStatus.CONFLICT).json({
        message: "You have already submitted this assignment",
      });
    }

    if (attachments && attachments.length > 0) {
      const allowedTypes = assignmentDoc.submitFileTypes;
      if (allowedTypes.length > 0) {
        const fileTypes = attachments.map((file) =>
          file.split(".").pop().toLowerCase()
        );
        const invalidTypes = fileTypes.filter(
          (type) => !allowedTypes.includes(type)
        );
        if (invalidTypes.length > 0) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: `Invalid file types. Allowed types: ${allowedTypes.join(
              ", "
            )}`,
          });
        }
      }
    }

    const submission = await SubmissionModel.create({
      student,
      assignment,
      attachments: attachments || [],
      status: "not-reviewed",
      isLateSubmission: req.body.isLateSubmission || false,
    });

    res.status(HttpStatus.CREATED).json({
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    next(error);
  }
};

export { filterAssignments, submitAssignment };
