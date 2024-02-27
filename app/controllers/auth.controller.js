const ApiError = require("../api-error");
const AuthService = require("../services/auth.service");
const Mongoose = require("../utils/mongodb.util");
exports.register = async (req, res, next) => {
  try {
    const authService = new AuthService(Mongoose.client);
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new ApiError(400, "Username and password are required."));
    }
    if (username.trim().length < 4 || username.trim().length > 25) {
      return next(
        new ApiError(400, "Usernames can be 4 to 25 characters long.")
      );
    }

    if (password.trim().length < 6 || password.trim().length > 200) {
      return next(
        new ApiError(
          400,
          "Passwords must be between 6 and 200 characters long."
        )
      );
    }

    const existUser = await authService.findByUsername(username);
    if (existUser) {
      return next(new ApiError(400, "This username is already in use."));
    }

    const document = await authService.create(req.body);
    if (!document)
      return next(new ApiError(400, "Could not create a new user"));
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating user"));
  }
};
