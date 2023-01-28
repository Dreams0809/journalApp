const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    
  },
  image: {
    type: String,
    
  },
  cloudinaryId: {
    type: String,
  
  },
  body: {
    type: String,
    
  },
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


 
});

module.exports = mongoose.model('Post', PostSchema);
