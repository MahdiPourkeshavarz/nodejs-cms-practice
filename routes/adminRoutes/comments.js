const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

router.get("/*", (req, res) => {
  req.app.locals.layout = "admin";
  next();
});

router.post("/:id", async (req, res) => {
  const postId = req.params.id;
  const { body } = req.body;
  let post;

  try {
    post = await Post.findOne({ _id: postId });
  } catch (err) {
    res.status(401).send("no post found");
  }

  const newComment = new Comment({
    user: req.user.id,
    body,
  });

  post.comments.push(newComment);

  try {
    const savedPost = await post.save();
    if (savedPost) {
      await newComment.save();
      res.redirect(`/post/${post.id}`);
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  let comments;
  try {
    comments = await Comment.find({ user: req.user.id }).populate("user");
    res.render("admin/comments", { comments });
  } catch (err) {
    res.status(404).send("no comments found");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).send("Comment not found");
    }

    const updatedPost = await Post.findOneAndUpdate(
      { comments: id },
      { $pull: { comments: id } },
      { new: true }
    );

    if (updatedPost) return res.redirect("/admin/comments");
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).send("Could not delete comment");
  }
});

module.exports = router;
