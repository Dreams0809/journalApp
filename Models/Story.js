const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  // title: {
  //   type: String,  
  // }, 
  likes: {
    type: Number,  
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  story:{
    type: String
  },

  // comment:{
  //   type:String
  // }
});

module.exports = mongoose.model('Story', StorySchema);