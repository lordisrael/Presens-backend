const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const lecturerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
  },
  profilePicture: {
    type: String,
    default: process.env.DEFAULT_PROFILE_PICTURE_URL, // Default profile picture URL
  },
  refreshToken: {
    type: String,
  },
});

// lecturerSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = bcrypt.hash(this.password, salt);
// });

lecturerSchema.pre("save", async function (next) {
  try {
    // Hash the password only if it's modified or a new user
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

lecturerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Lecturer", lecturerSchema);
