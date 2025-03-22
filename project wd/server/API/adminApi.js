const exp = require("express");
const adminApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const { requireAuth, clerkMiddleware } = require("@clerk/express");

// authorApp.use(clerkMiddleware());

// API
adminApp.get("/", (req, res) => {
  res.send({ message: "from admin api" });
});

async function createAdmin(req, res) {
  const admin = req.body;
  const adminInDb = await Admin.findOne({ email: admin.email });
  if (adminInDb != null) {
    if (adminInDb.role != undefined) {
      res.status(200).send({ message: "Invalid role" });
    } else {
      res
        .status(200)
        .send({ message: "admin already exist", payload: adminInDb });
    }
  } else {
    // console.log(admin);
    let newAdmin = new Admin(admin);
    let adminDoc = await newAdmin.save();
    // console.log(adminDoc);
    res.status(201).send({ message: "admin created", payload: adminDoc });
  }
}
// creatng admin
adminApp.post("/create-admin", expressAsyncHandler(createAdmin));

// get all users and authors
adminApp.get(
  "/get-all",
  expressAsyncHandler(async (req, res) => {
    const AllUsers = await UserAuthor.find();
    res.status(201).send({ message: "success", payload: AllUsers });
  })
);

// block a user or admin
adminApp.post(
  "/block-unblock",
  expressAsyncHandler(async (req, res) => {
    // res.send({ message: "from block", payload: req.body });
    // req.body.isActive = false;
    console.log(req.body);
    const query_res = await UserAuthor.updateOne({ email: req.body.email }, [
      { $set: { isActive: { $not: "$isActive" } } },
    ]);
    res.send({ payload: query_res });
  })
);

module.exports = adminApp;
