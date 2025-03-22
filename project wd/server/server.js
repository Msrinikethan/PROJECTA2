const exp = require("express");
const app = exp();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

app.use(cors());

// .json returns a middleware function that parses json
const jsonParserMiddleware = exp.json();
app.use(jsonParserMiddleware);
require("dotenv").config();
//config method return nothing, it add all vars from .env into env of process var which is a global var in node process.env
const port = process.env.PORT || 4000;
// console.log(process.env);
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening on ${port}`);
    });
    console.log(`DB connection success`);
  })
  .catch((err) => {
    console.log(`Error in DB connection`, err);
  });

// app.use(clerkMiddleware());

//   connect api route
app.use("/user-api", require("./API/userApi"));
app.use("/author-api", require("./API/authorApi"));
app.use("/admin-api", require("./API/adminApi"));

// invalid path middleware
app.use((req, res) => {
  if (!res.headersSent)
    res.status(404).sendFile(path.join(__dirname, "pathnotfound.html"));
});
app.use((err, req, res, next) => {
  console.log("err object in express error handler:", err);

  res.send({ message: err.message });
});
