const exp = require("express");
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");
const { requireAuth, clerkMiddleware } = require("@clerk/express");
// require
// API

authorApp.use(clerkMiddleware());

authorApp.get("/", (req, res) => {
  res.send({ message: "from author api" });
});

// authorApp.use(requireAuth({signInUrl:"unauthorized"}));

// create new author
authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));

// create new article
authorApp.post(
  "/article",
  expressAsyncHandler(async (req, res) => {
    // get  new article obj from req
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "article published", payload: articleObj });
  })
);
//read all articles
authorApp.get(
  "/articles",
  // customRequireAuth({ signInUrl: "unauthorized" }),
  requireAuth({ signInUrl: "unauthorized" }),
  expressAsyncHandler(async (req, res) => {
    // console.log("Incoming Request Headers:", req.headers);
    console.log("Incoming Auth Token:", req.headers.authorization);
    //read all articles from db
    const listOfArticles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "articles", payload: listOfArticles });
  })
);
authorApp.get("/unauthorized", (req, res) => {
  res.send("unauth from clerk");
});

//modify an article by article id
authorApp.put(
  "/article/:id",
  requireAuth({ signInUrl: "unauthorized" }),
  expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const modifiedArticleObj = await Article.findByIdAndUpdate(
      modifiedArticle._id,
      { ...modifiedArticle },
      { new: true }
    );
    res.send({ message: "article modified", payload: modifiedArticleObj });
  })
);

// delete an article by article id
// using put instead of delete for SOFT DELETE
authorApp.put(
  "/articles/:id",
  requireAuth({ signInUrl: "unauthorized" }),
  expressAsyncHandler(async (req, res) => {
    //get modified article
    const modifiedArticle = req.body;
    //update article by article id
    const latestArticle = await Article.findByIdAndUpdate(
      modifiedArticle._id,
      { ...modifiedArticle },
      { returnOriginal: false }
    );
    res
      .status(200)
      .send({ message: "article deleted or restored", payload: latestArticle });
  })
);

module.exports = authorApp;
