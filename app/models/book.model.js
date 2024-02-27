const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    code: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    price: {
      type: int,
      require: true,
    },
    quantity: {
      type: int,
      require: true,
    },
    publishYear: {
      type: int,
      require: true,
    },
    publishCode: {
      type: String,
      require: true,
      unique: true,
    },
    country: {
      type: String,
    },
    author: {
      type: String,
    },
    position: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = model("User", userSchema);
