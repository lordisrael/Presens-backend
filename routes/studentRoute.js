const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

const { registerStudent, getAllStudent } = require("../controllers/studentCtrl");

router.post("/register", auth, registerStudent);
router.get("/get-all-students",auth, getAllStudent);

module.exports = router;
