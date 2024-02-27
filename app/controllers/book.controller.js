const ApiError = require("../api-error");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const { name, price, quantity, publishYear, code } = req.body;
    if (!name) {
      return next(new ApiError(400, "Name cannot be empty."));
    }
    if (!price) {
      return next(new ApiError(400, "Price is required."));
    }
    if (!quantity) {
      return next(new ApiError(400, "Quantity is required."));
    }
    if (
      !Number.isInteger(price) &&
      !Number.isInteger(quantity) &&
      !Number.isInteger(publishYear)
    )
      return next(new ApiError(400, "This field must be a number."));
    const isExist = await bookService.findByCode(code);
    if (isExist) return next(new ApiError(404, "This code is already in use."));
    const document = await bookService.create(req.body);
    return res.send({ message: "Created book successfully." });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating the book.")
    );
  }
};
exports.findByCode = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findByCode(req.params.code);
    if (!document) {
      return next(new ApiError(404, "Code not found."));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with code=${req.params.code}.`)
    );
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { name } = req.query;

    if (name) {
      documents = await bookService.findByName(name);
    } else {
      documents = await bookService.findAllBooks();
    }
  } catch (error) {
    return next(new ApiError(500, "An error occured while retrieving books."));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found."));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}.`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new ApiError(400, "Data to update cannot be empty."));
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);
    if (!document) return next(new ApiError(404, "Book not found."));
    return res.send({ message: "Book was updated successfully." });
  } catch (error) {
    //console.log(error);
    return next(
      new ApiError(500, `Error updating book with id ${req.params.id}.`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document.deletedCount)
      return next(new ApiError(404, "Book not found."));
    return res.send({ message: "Book was deleted successfully." });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete the book with id ${req.params.id}.`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();
    return res.send({
      message: `${deletedCount} book${
        deletedCount >= 2 ? "s were" : " was"
      } deleted successfully.`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all books.")
    );
  }
};
