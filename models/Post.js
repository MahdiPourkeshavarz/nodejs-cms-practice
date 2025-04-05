const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
    },
    status: {
      type: String,
      required: true,
      default: "public",
    },
    allowComments: {
      type: Boolean,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  },
  { usePushEach: true }
);

module.exports = mongoose.model("posts", PostSchema);
