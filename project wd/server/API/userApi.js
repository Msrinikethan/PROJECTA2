const exp = require("express");
const userApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");

// API

userApp.get("/users", async (req, res) => {
  let usersList = await UserAuthor.find({ role: "user" });
  res.send({ message: "Users", payload: usersList });
});

userApp.post("/user", expressAsyncHandler(createUserOrAuthor));

// add comment
userApp.put(
  "/comment/:articleId",
  expressAsyncHandler(async (req, res) => {
    const commentObj = req.body;
    // add comment obj to comments array of article
    const articleWithComments = await Article.findOneAndUpdate(
      { articleId: req.params.articleId },
      { $push: { comments: commentObj } },
      { new: true }
    );
    // send response
    res
      .status(200)
      .send({ message: "comment added", payload: articleWithComments });
  })
);
module.exports = userApp;
