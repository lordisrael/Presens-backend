const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"]
  },
  matric_no: {
    type: String,
    required: [true, "Please provide matricNo"],
    unique: true,
  },
  department: {
    type: String,
    required: [true, "Please select department"],
    enum: ["EEE", "CPE", "ICE"],
  },
  level: {
    type: Number,
    required: [true, "Please input your level"]
  },
  fingerprint: {
    type: String, // Store fingerprint data as binary
    required: true,
    unique:true
  },
});


// Pre-save middleware to convert base64 string to Buffer
studentSchema.pre('save', function(next) {
  if (typeof this.fingerprint === 'string') {
    const hashedfingerprint = Buffer.from(this.fingerprint, 'base64');
    this.fingerprint = hashedfingerprint
    return next();
  }
  next();
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
