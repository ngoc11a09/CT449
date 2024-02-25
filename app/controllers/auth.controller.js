const ApiError = require("../api-error");
const AuthService = require("../services/auth.service");
const Mongoose = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const authService = new AuthService(Mongoose.client);
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new ApiError(400, "username and password are empty"));
    }
    if (username.trim().length < 4) {
      return next(
        new ApiError(400, "username must be longer than 4 characters")
      );
    }
    if (username.trim().length > 25) {
      return next(
        new ApiError(400, "username must be shorter than 25 characters")
      );
    }
    if (password.trim().length < 6) {
      return next(
        new ApiError(400, "password must be longer than 6 characters")
      );
    }

    const existUser = await authService.findByUsername({ username });
    if (existUser) {
      return next(new ApiError(400, "username already exists"));
    }
    const document = await authService.create(req.body);
    if (!document) return next(new ApiError(400, "Could not create new user"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating user"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const authService = new AuthService(Mongoose.client);
    const { username } = req.query;

    if (username) {
      documents = await authService.findByUsername(username);
    } else {
      documents = await authService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occured while get all users"));
  }
  return res.send(documents);
};
