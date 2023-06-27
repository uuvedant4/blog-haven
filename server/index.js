const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const Post = require("./models/Post");

const app = express();
dotenv.config();

const upload = multer({ dest: "uploads" });
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(`${__dirname}/uploads`));

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

app.post("/post", upload.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, info) => {
    if (error) {
      throw error;
    }
    const { title, summary, content } = req.body;
    const newPost = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(newPost);
  });
});

app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (error, info) => {
    if (error) {
      throw error;
    }
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not the author.");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
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

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postInfo = await Post.findById(id).populate("author", ["username"]);
  res.json(postInfo);
});

connectDB();
