//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://nisarg:nisarg@cluster0-x2a77.mongodb.net/testDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  res.render("compose");
});

app.get("/test", function(req, res) {
  Post.find({}, function(err, posts){
    res.render("test", {posts: posts});
  });
});

app.get("/delete/:postId", function(req, res) {
  const postid = req.params.postId;

  Post.deleteOne({_id: postid}, function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/test");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
    const postid = req.params.postId;

    Post.findOne({_id: postid}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/edit/:postId", function(req, res) {
    const postid = req.params.postId;
    Post.findOne({_id: postid}, function(err, found) {
      if(err) {
        console.log(err);
      } else {
          res.render("edit", {title: found.title,content: found.content});
          Post.deleteOne({_id: found._id}, function(err) {
            if(err) {
              console.log(err);
            }
          });
      }
    });

});

app.post("/", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/test");
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
