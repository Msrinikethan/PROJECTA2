const mongoose = require("mongoose");

const adminDataSchema = new mongoose.Schema(
  {
    nameOfAdmin: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { strict: "throw" }
);

const Admin = mongoose.model("admin", adminDataSchema);

module.exports = Admin;
