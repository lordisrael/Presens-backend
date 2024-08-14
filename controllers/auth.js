const Lecturer = require("../models/lecturer");
const jwt = require("jsonwebtoken");
const { createJWT } = require("../config/jwt");
const { createRefreshJWT} = require("../config/refreshjwt")
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const {
  ConflictError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");


const registerLecturer = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userAlreadyExists = await Lecturer.findOne({ email });
  if (!userAlreadyExists) {
    const user = await Lecturer.create(req.body);
    const token = createJWT(user.id, user.name);
    res.status(StatusCodes.CREATED).json({status: "Success", data: user, token: token});
  } else {
    throw new ConflictError("Email already Exists");
  }
});

const login = asyncHandler(async (req, res) => {
  // Trim email and password to remove any trailing spaces
  const { email, password } = req.body;
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const user = await Lecturer.findOne({ email: trimmedEmail });
  if (user && (await user.comparePassword(trimmedPassword))) {
    const refreshToken = createRefreshJWT(user._id);
    await Lecturer.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      status: "Success",
      token: createJWT(user._id, user.firstname),
    });
  } else {
    throw new UnauthenticatedError("Invalid credentials");
  }

});

module.exports = {
    registerLecturer,
    login
}