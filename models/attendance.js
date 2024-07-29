const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const attendanceSchema = new mongoose.Schema({
  course_code: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  studentsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
    },
  ],
  course_title: {
    type: String,
    required: true,
  },
});



module.exports = mongoose.model("Attendance", attendanceSchema);