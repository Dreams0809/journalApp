const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  // title: {
  //   type: String,  
  // }, 
  likes: {
    type: Number,  
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  comment:{
    type:String
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  userName: {
    type: String,
    ref: "Story"

  },



});

module.exports = mongoose.model('Comment', CommentSchema);