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
    const subjects = subjectIds.split(",").map((id) => id.trim());
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

    if (
      !assignmentDoc.isLateSubmissionAllowed &&
      new Date() > assignmentDoc.dueDateTime
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Late submission is not allowed",
      });
    }

    if (
      assignmentDoc.isLateSubmissionAllowed &&
      new Date() > assignmentDoc.dueDateTime
    ) {
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

const getSubmissions = async (req, res, next) => {
  try {
    const student = req.user._id;
    const { statuses } = req.query;

    const filterObject = {
      student,
    };

    if (statuses) {
      const validStatuses = ["reviewed", "re-submit", "not-reviewed"];
      const requestedStatuses = statuses
        .split(",")
        .map((status) => status.trim());

      const invalidStatuses = requestedStatuses.filter(
        (status) => !validStatuses.includes(status)
      );

      if (invalidStatuses.length > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Invalid status values: ${invalidStatuses.join(
            ", "
          )}. Valid statuses are: ${validStatuses.join(", ")}`,
        });
      }

      filterObject.status = {
        $in: requestedStatuses,
      };
    }

    const submissions = await SubmissionModel.find(filterObject);

    res.status(HttpStatus.OK).json({
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingSubmission = await SubmissionModel.findOne({
      _id: id,
      student: req.user._id,
    });

    if (!existingSubmission) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Submission not found",
      });
    }

    if (!existingSubmission.assignment.isActive) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Assignment is not active",
      });
    }

    if (existingSubmission.status !== "re-submit") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Submission is not in re-submit status",
      });
    }

    const { attachments } = req.body;

    if (attachments && attachments.length > 0) {
      const allowedTypes = existingSubmission.assignment.submitFileTypes;
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

    const updatedSubmission = await SubmissionModel.findOneAndUpdate(
      { _id: id, student: req.user._id },
      {
        status: "not-reviewed",
        isResubmit: true,
        attachments: req.body.attachments,
        marks: 0,
      },
      { new: true, runValidators: true }
    );

    res.status(HttpStatus.OK).json({
      message: "Submission updated successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    next(error);
  }
};

export {
  filterAssignments,
  submitAssignment,
  getSubmissions,
  updateSubmission,
};
