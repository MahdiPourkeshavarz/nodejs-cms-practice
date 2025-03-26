const express = require("express");
const router = express.Router();
const postSchema = require("../../models/Post.js");
const Post = require("../../models/Post.js");

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
  const posts = await Post.find({});
  if (posts) {
    res.render("admin/posts", { posts: posts });
  }
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Post.findOne({ _id: id });
  res.render("admin/posts/edit", { post: post });
});

router.post("/update/:id", async (req, res) => {
  try {
    const { title, status, allowComments, body } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        allowComments: allowComments === "on",
        body,
      },
      { new: true }
    );
    res.redirect("/admin/posts");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post");
  }
});

module.exports = router;
