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
      const posts = await Post.find().sort({ createdAt: "desc"}).lean();
      const story = await Story.find().sort({ createdAt: "desc"}).lean();
      res.render("feed.ejs", { posts: posts, user: req.user, story: story });
    } catch (err) {
      console.log(err);
    }
  },

  getComment: async (req, res) =>{
    try{
      const story = await Story.find().sort({ createdAt: "desc"}).lean();
      const comment = await Comment.find({ user: req.user.id }); 
      res.render("comments.ejs", {user: req.user, comment:comment, story: story})
    } catch (err){
      console.log(err);
    }
  },
  
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  createComment: async (req,res) => {
    try{
      await Comment.create({
        comment:req.body.comment
      });
      console.log("Comment has been added!");
      res.redirect("/comments");
    } catch (err){
      console.log(err)
    }
  },

  createStory: async (req,res) => {
    try{
      await Story.create({
        story: req.body.story
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
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};