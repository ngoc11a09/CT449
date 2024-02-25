const express = require("express");
const cors = require("cors");
const booksRouter = require("./app/routes/book.route");
const authRouter = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/books", booksRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  //code khi notfound
  return next(new ApiError(404, "Resource not found!"));
});
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
