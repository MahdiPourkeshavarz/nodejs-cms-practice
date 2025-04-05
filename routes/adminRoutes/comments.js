const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

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

module.exports = router;
