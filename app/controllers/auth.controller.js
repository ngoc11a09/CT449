const ApiError = require("../api-error");
const AuthService = require("../services/auth.service");
const Mongoose = require("../utils/mongodb.util");
exports.register = async (req, res, next) => {
  try {
    const authService = new AuthService(Mongoose.client);
    const { username, password, email, phone } = req.body;
    //username and password
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

    //username
    const existUser = await authService.findByUsername(username);
    if (existUser) {
      return next(new ApiError(400, "This username is already in use."));
    }
    //email
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!validateEmail(email))
      return next(new ApiError(400, "Invalid email address"));
    const existEmail = await authService.findByEmail(email);
    if (existEmail) {
      return next(new ApiError(400, "Email already exists"));
    }
    //Phone number
    const validatePhone = (phone) => {
      return String(phone).match(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      );
    };
    if (!validatePhone(phone))
      return next(new ApiError(400, "Invalid phone number"));
    const existPhone = await authService.findByPhone(phone);
    if (existPhone) {
      return next(new ApiError(400, "Phone number already exists"));
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
