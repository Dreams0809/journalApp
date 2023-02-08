const { image } = require("../middleware/cloudinary");
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Story = require("../models/Story")
const Comment = require("../models/Comment")


module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  
  getFeed: async (req, res) => {
    try {
      
      const story = await Story.find().sort({ createdAt: "desc"}).lean();
      res.render("feed.ejs", { user: req.user, story: story });
    } catch (err) {
      console.log(err);
    }
  },
 
  getComment: async (req, res) =>{
    try{
      
      const story = await Story.findOne({ _id:req.params.id})
      const comment = await Comment.find({ storyId: req.params.id });  
      res.render(`comments.ejs`, {user: req.user, comment:comment, story: story })
    } catch (err){
      console.log(err);
    }
  },
  
  getPost: async (req, res) => {
    try {
      const story = await Story.findOne({ id:req.params.id})
      const comment = await Comment.find({ storyId: req.params.id });  
      res.render("indexx.ejs", { story: story, comment: comment, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  createComment: async (req,res) => {
    try{
      
      await Comment.create({
        comment:req.body.comment,
        likes: 0,
        storyId: req.body.storyId,
        user: req.user._id,
        userName: req.user.userName
      });
      console.log("Comment has been added!");
      res.redirect(`/comments/${req.body.storyId}`);
    } catch (err){
      console.log(err)
    }
  },

  createStory: async (req,res) => {
    try{
      await Story.create({
        story: req.body.story,
        likes: 0,
        user: req.user._id,
        userName: req.user.userName
      }); 
      console.log("Story has been added");
      res.redirect("/feed");
    } catch (err){
      console.log(err);
    }
  },
  
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      let img 
      let imageId
      let result
      if( req.file != undefined){
        result = await cloudinary.uploader.upload(req.file.path);
        img = result.secure_url
        imageId = result.public_id
      }else{
        console.log("Else has started")
        img = ""
        imageId = ""
      }
    
      await Post.create({
        title: req.body.title,
        image: img, 
        cloudinaryId: imageId,
        body: req.body.body,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },


  

  likePost: async (req, res) => {
    try {
      let story = await Story.findById(req.params.id)
      story.likes++
      await story.save()
      console.log("Likes +1");
      res.redirect("/feed");
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      let story = await Story.findOne({ _id: req.params.id });
      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(story.cloudinaryId);
      // Delete post from db
      await Story.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },


  deleteComment: async (req, res) => {
    try {
      // Find post by id
      let comment = await Comment.findOne({ _id: req.params.id });
      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(story.cloudinaryId);
      // Delete post from db
      await Comment.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect(`/comments/${req.body.storyId}`);
    } catch (err) {
      res.redirect(`/comments/${req.body.storyId}`);
    }
  }




};