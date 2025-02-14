import { issueJwt } from "../utils/jwtUtils.js";
import { checkPassword } from "../utils/hashUtils.js";
import StudentModel from "../models/Student.model.js";
import ParentModel from "../models/Parent.model.js";
import SchoolAdminModel from "../models/SchoolAdmin.model.js";
import SystemAdminModel from "../models/SystemAdmin.model.js";
import HttpStatus from "../constants/httpStatus.js";
import InstructorModel from "../models/Instructor.model.js";

const register = async (req, res, next) => {
  const { userType, password, ...userData } = req.body;

  const models = [
    StudentModel,
    ParentModel,
    InstructorModel,
    SchoolAdminModel,
    SystemAdminModel,
  ];

  for (const model of models) {
    let existingUser;

    existingUser = await model.findOne({ email: userData.email });

    if (existingUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Email already exist" });
    }

    if (userType != "systemAdmin") {
      existingUser = await model.findOne({ username: userData.username });

      if (existingUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Username already exist" });
      }
    }
  }

  let UserModel;

  switch (userType) {
    case "student":
      UserModel = StudentModel;
      break;
    case "parent":
      UserModel = ParentModel;
      break;
    case "instructor":
      UserModel = InstructorModel;
      break;
    case "schoolAdmin":
      UserModel = SchoolAdminModel;
      break;
    case "systemAdmin":
      UserModel = SystemAdminModel;
      break;
    default:
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Invalid user type" });
  }

  try {
    const newUser = await UserModel.create({ ...userData, hash: password });

    const { access_token, refresh_Token } = issueJwt(
      newUser._id,
      newUser.username
    );

    res.cookie("accessToken", access_token, {
      httpOnly: true,
      maxAge: 900000,
      sameSite: "Strict",
      secure: true,
    });

    res.cookie("refreshToken", refresh_Token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: true,
    });

    res
      .status(HttpStatus.CREATED)
      .json({ message: "User registered successfully", newUser });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { username, password, email } = req.body;

  const models = [
    StudentModel,
    ParentModel,
    InstructorModel,
    SchoolAdminModel,
    SystemAdminModel,
  ];

  let user;

  try {
    for (const model of models) {
      if (email) {
        user = await model.findOne({ email });
      } else {
        user = await model.findOne({ username });
      }

      if (user) break;
    }

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = checkPassword(password, user.salt, user.hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { access_token, refresh_Token } = issueJwt(user._id, user.username);

    res.cookie("accessToken", access_token, {
      httpOnly: true,
      maxAge: 900000,
      sameSite: "Strict",
      secure: true,
    });

    res.cookie("refreshToken", refresh_Token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: true,
    });

    res.status(HttpStatus.OK).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// const login = async (req, res, next) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return next(new BadRequest("username and password must be provided"));
//   }

//   try {
//     const user = await UserModel.findOne({ username });
//     if (!user) {
//       return next(new NotFound("User not found"));
//     }

//     if (!checkPassword(password, user.salt, user.hash)) {
//       return next(new BadRequest("Invalid Password"));
//     }

//     const { access_token, refresh_Token } = issueJwt(user._id, user.username);

//     res.cookie("accessToken", access_token, {
//       httpOnly: true,
//       maxAge: 900000,
//       sameSite: "Strict",
//       secure: true,
//     });

//     res.cookie("refreshToken", refresh_Token, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       sameSite: "Strict",
//       secure: true,
//     });

//     res.status(200).json({ success: true, data: user });
//   } catch (err) {
//     next(err);
//   }
// };

const logout = (req, res, next) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  });
};

export { register, login, logout };
