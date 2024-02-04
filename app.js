const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const homeStartingContent =
  "WELCOME TO MY BLOG WEBSITE";
const aboutContent =
  "This Blog app is my first blog wibsite";
const contactContent =
"Contact me :jadalsayegh10@gmail.com";
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://jadalsayegh10:Give504@cluster0.bcqntfr.mongodb.net/blogDB");
 
  const postSchema = {
    title: String,
    text: String,
  };

  const Post = mongoose.model("Post", postSchema);

  app.get("/", async function (req, res) {
    const posts = await Post.find();
    if(posts === null){
      const poster = [];
       res.render("home", {
      startingContent: homeStartingContent,
      posts: poster,
    });
    }else{
      res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      });
    }
   
  });

  app.get("/about", function (req, res) {
    res.render("about", { aboutContent: aboutContent });
  });

  app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactContent });
  });

  app.get("/compose", function (req, res) {
    res.render("compose");
  });

  app.post("/compose", async function (req, res) {
    const post = new Post({
      title: req.body.postTitle,
      text: req.body.postBody
    });

    await post.save();

    res.redirect("/");
  });

  app.get("/posts/:postId",async function(req, res){
    const requestedId =req.params.postId;
    const posts = await Post.findById(requestedId).exec();

        res.render("post", {
          title: posts.title,
          text: posts.text
        });
  });

  app.listen(process.env.PORT ||3000, function () {
    console.log("Server started");
  });
}
