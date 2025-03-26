const mongoose = require("mongoose");

const Schema = mongoose.Schema();

const PostSchema = Schema({
  user: {},
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
});

module.exports = mongoose.model("Post", PostSchema);
