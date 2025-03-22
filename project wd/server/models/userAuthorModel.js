const mongoose = require("mongoose");

// define User or Author schema
const userAuthorSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { strict: true }
);

// create model for user author schema
// this name will be pluralized and a collection will be created in the database
const UserAuthor = mongoose.model("userAuthor", userAuthorSchema);
module.exports = UserAuthor;
