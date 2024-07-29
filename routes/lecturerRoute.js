const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


const {
  registerLecturer, login
} = require("../controllers/auth");


router.post("/register", registerLecturer);
router.post("/login", login)

module.exports = router