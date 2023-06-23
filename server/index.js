const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User({
      username,
      password: hashedPassword,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isMatch = bcrypt.compareSync(password, user.password);
  if (isMatch) {
    jwt.sign(
      { id: user._id, username },
      process.env.JWT_SECRET_KEY,
      {},
      (error, token) => {
        if (error) {
          throw error;
        }
        res.cookie("token", token).json({
          id: user._id,
          username,
        });
      }
    );
  } else {
    res.status(400).json("Invalid credentials.");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (error, info) => {
    if (error) {
      throw error;
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_CONNECTION_URI)
    .then(() => {
      console.log("Database connection successful.");
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

connectDB();
