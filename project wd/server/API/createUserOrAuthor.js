const UserAuthor = require("../models/userAuthorModel");

async function createUserOrAuthor(req, res) {
  //   get user or author data from req.body
  const newUserAuthor = req.body;
  // find user by email id
  const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });

  //   if user by email if found
  if (userInDb !== null) {
    //check with role
    if (newUserAuthor.role === userInDb.role) {
      res.status(200).send({ message: newUserAuthor.role, payload: userInDb });
    } else {
      res.status(200).send({ message: "Invalid role" });
    }
  } else {
    let newUser = new UserAuthor(newUserAuthor);
    let newUserOrAuthorDoc = await newUser.save();
    res
      .status(201)
      .send({ message: newUserOrAuthorDoc.role, payload: newUserOrAuthorDoc });
  }
}

module.exports = createUserOrAuthor;
