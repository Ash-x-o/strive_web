require('dotenv').config();
const express = require("express");
// const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require("path");


const userApi = require("./user");
const exerciseApi = require("./exercise");
const routineApi = require("./routine");

app.set('trust proxy', 1);
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT;
const HOST = process.env.LOCAL_HOST;
const MONGO_URI = process.env.MONGO_URI;

app.use('/uploads', express.static('uploads'));

// React build
app.use(express.static(
  path.join(__dirname, "../frontend/build")
));

app.use("/api/users", userApi);
app.use("/api/exercises", exerciseApi);
app.use("/api/routines", routineApi);

app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));