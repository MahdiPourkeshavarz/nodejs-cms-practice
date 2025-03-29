const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Post = require("../../models/Post.js");
const { IsFileUploaded, uploadDir } = require("../../utils/index.js");
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

  let errors = [];

  if (!title) {
    errors.push({ message: "please add title" });
  } else if (!status) {
    errors.push({ message: "please add status" });
  } else if (!body) {
    errors.push({ message: "please add description for post" });
  } else if (!req.files?.file) {
    errors.push({ message: "please add image for post" });
  } else if (errors.length > 0) {
    res.render("admin/posts/create", {
      errors,
    });
  }

  if (!title || !status || !body) {
    return res.status(400).json({
      message: "All fields are necessary for creating post!.",
    });
  }

  const allowedStatuses = ["draft", "published"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Must be 'draft' or 'published'.",
    });
  }

  let file;
  let fileName = "not uploaded";
  if (IsFileUploaded(req.files)) {
    file = req.files?.file;
    fileName = `${Date.now()}-${file.name}`;
    file.mv("../../public/uploads/" + fileName, (err) => {
      console.log(err);
    });
  } else {
    console.log("file not uploaded");
  }

  const newPost = new Post({
    title,
    status,
    allowComments: Boolean(allowComments),
    body,
    file: fileName,
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

router.put("/edit/:id", async (req, res) => {
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
    if (updatedPost) {
      res.status(200).send("post updated!");
      res.redirect("/admin/posts");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletePost = await Post.fineOne({ _id: id });
    fs.unlink(uploadDir + deletePost.file, (err) => {
      console.log(err);
    });
    await deletePost.remove();
    res.redirect("/admin/posts");
  } catch (error) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});

module.exports = router;
