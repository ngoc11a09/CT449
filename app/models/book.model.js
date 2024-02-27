const { model, Schema } = require("mongoose");

const bookSchema = new Schema(
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
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    publishYear: {
      type: Number,
      require: true,
    },
    publishCode: {
      type: String,
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
module.exports = model("Book", bookSchema);
