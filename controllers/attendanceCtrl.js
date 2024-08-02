const Attendance = require("../models/attendance");
const Student = require("../models/students")
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const moment = require("moment");

const {
  ConflictError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

const createAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.create(req.body);
    const formattedDate = moment(attendance.dateCreated).format("MMMM Do");

    res.status(StatusCodes.CREATED).json({
      status: "Success",
      data: {
        ...attendance.toObject(),
        dateCreated: formattedDate,
      },
    });
})

const deleteAttendance = asyncHandler(async (req, res) => {
    const { id: attendanceId } = req.params;

    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Fail",
        message: "Attendance record not found",
      });
    }

    await Attendance.findByIdAndDelete(attendanceId);

    res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Attendance record deleted successfully",
    });
})

const takeAttendance = asyncHandler(async (req, res) => {
  const { fingerprint } = req.body;
  const { id: attendanceId } = req.params;
  const student = await Student.findOne({
    fingerprint: Buffer.from(fingerprint, "base64"),
  });

  if (!student) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: "Fail", message: "Student not found" });
  }

  // Find the attendance record by attendanceId
  let attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: "Fail",
      message: "Attendance record not found",
    });
  }

  // Check if the student is already registered in this attendance
  if (attendance.studentsId.includes(student._id)) {
    return res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Student already registered in attendance",
    });
  }

  // Add the student to the attendance record
  attendance.studentsId.push(student._id);
  await attendance.save();

  res.status(StatusCodes.OK).json({ status: "Success", data: attendance });
})

const getAllattendance = asyncHandler(async(req, res) => {
    const attendance = await Attendance.find().sort({ dateCreated: -1 });
    const formattedDate = moment(attendance.dateCreated).format("MMMM Do");
    res.status(StatusCodes.OK).json({
      status: "Success",
      data: {
        ...attendance.toObject(),
        dateCreated: formattedDate,
      },
    });
})

const getStudentAttendance = asyncHandler(async(req, res) => {
    const { id: attendanceId } = req.params;
    const attendance = await Attendance.findById(attendanceId).populate(
      "studentsId"
    );

    if (!attendance) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "Fail",
        message: "Attendance record not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: "Success",
      data: attendance.studentsId,
    });
})

module.exports = {
    createAttendance,
    deleteAttendance,
    takeAttendance,
    getAllattendance,
    getStudentAttendance
}