const Student = require('../models/students')
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const {
  ConflictError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");


const registerStudent = asyncHandler(async (req, res) => {
  const { matric_no } = req.body;
  const userAlreadyExists = await Student.findOne({ matric_no });
  if (!userAlreadyExists) {
    const user = await Student.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "Success", data: user });
  } else {
    throw new ConflictError("Student Already Exists");
  }
});

const getAllStudent = asyncHandler(async(req, res) => {
    const students = await Student.find();
    res.status(StatusCodes.OK).json({status:"Success", data: students, total:students.length});
});

module.exports = {
    registerStudent,
    getAllStudent
}