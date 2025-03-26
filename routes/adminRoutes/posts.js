const express = require("express");
const router = express.Router();
const postSchema = require("../../models/Post.js");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/create", (req, res) => {
  res.render("admin/posts/create");
});

router.post("/create", async (req, res) => {
  const { title, status, allowComments = false, body } = req.body;

  if (!title || !status || !body) {
    return res.status(400).json({
      message: "Title, status, and body are required.",
    });
  }

  const allowedStatuses = ["draft", "published"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Must be 'draft' or 'published'.",
    });
  }

  const newPost = new Post({
    title,
    status,
    allowComments: Boolean(allowComments),
    body,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json({
      message: "Post created successfully.",
      post: savedPost,
    });
    res.redirect("/admin");
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).json({
      message: "Failed to create post. Please try again.",
    });
  }
});

router.get("/", async (req, res) => {
  res.render("admin/posts");
});

module.exports = router;
