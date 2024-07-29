const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const {
  createAttendance,
  getAllattendance,
  takeAttendance,
  getStudentAttendance,
  deleteAttendance,
} = require("../controllers/attendanceCtrl");

router.post("/register", auth, createAttendance);
router.get("/get-all-attendance", auth, getAllattendance);
router.patch("/take-attendance/:id", auth, takeAttendance);
router.get("/list-student/:id", auth, getStudentAttendance);
router.delete("/delete/:id", auth, deleteAttendance)

module.exports = router;
