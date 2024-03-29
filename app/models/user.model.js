const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    code: {
      type: String,
      require: true,
      unique: true,
    },
    role: {
      type: String,
      require: true,
      default: "user",
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    familyName: {
      type: String,
    },
    name: {
      type: String,
      require: true,
    },
    birthday: {
      type: Date,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = model("User", userSchema);
