import jwt from "jsonwebtoken";
import fs from "fs";
import InstructorModel from "../models/Instructor.model";
import StudentModel from "../models/Student.model";
import ParentModel from "../models/Parent.model";
import SystemAdminModel from "../models/SystemAdmin.model";
import SchoolAdminModel from "../models/SchoolAdmin.model";

const userModels = {
  student: StudentModel,
  instructor: InstructorModel,
  parent: ParentModel,
  schoolAdmin: SchoolAdminModel,
  systemAdmin: SystemAdminModel,
};

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;

    if (!token) throw new Unauthorized("unauthenticated user");

    const ACCESS_TOKEN_PUB_KEY = fs.readFile("accessToken_publicKey.pem");

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_PUB_KEY, {
        algorithms: ["RS256"],
      });

      const userModel = userModels[decoded.userType];
      if (!userModel) throw new Unauthorized("Invalid user type");

      const user = await userModel.findById(decoded.id).select("-hash -salt");
      if (!user) throw new Unauthorized("User not found");

      req.user = user;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        if (!refreshToken) throw new Unauthorized("unauthenticated user");

        const REFRESH_TOKEN_PUB_KEY = fs.readFile("refreshToken_publicKey.pem");

        const refreshDecoded = jwt.verify(refreshToken, REFRESH_TOKEN_PUB_KEY, {
          algorithms: ["RS256"],
        });

        const userModel = userModels[refreshDecoded.userType];
        if (!userModel) throw new Unauthorized("Invalid user type");

        const user = await userModel
          .findById(refreshDecoded.id)
          .select("-hash -salt");
        if (!user) throw new Unauthorized("User not found");

        const ACCESS_TOKEN_PRIV_KEY = fs.readFile("accessToken_privateKey.pem");

        const newAccessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            userType: user.userType,
          },
          ACCESS_TOKEN_PRIV_KEY,
          { algorithm: "RS256", expiresIn: "15m" }
        );

        res.cookie("accessToken", `Bearer ${newAccessToken}`, {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000,
          secure: true,
        });

        req.user = user;
        return next();
      } else {
        throw new BadRequest("Invalid access token");
      }
    }
  } catch (error) {
    next(error);
  }
};
