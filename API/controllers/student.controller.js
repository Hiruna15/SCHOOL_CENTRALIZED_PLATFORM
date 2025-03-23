import HttpStatus from "../constants/httpStatus.js";
import AssignmentModel from "../models/Assignment.model.js";

const filterAssignments = async (req, res, next) => {
  const { classId, subjectIds, isActive } = req.query;

  const filterObject = {};

  if (classId) {
    filterObject.class = classId;
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

export { filterAssignments };
