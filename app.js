const express = require('express')
require("dotenv").config();

const app = express()

const cookieParser = require("cookie-parser");
const authRoute = require("./routes/lecturerRoute");
const studentRoute = require("./routes/studentRoute")
const attendanceRoute = require("./routes/attendanceRoute")

const dbConnect = require("./config/db");

const notFoundMiddleware = require("./middleware/not-Found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/student", studentRoute)
app.use("/api/v1/attendance", attendanceRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
