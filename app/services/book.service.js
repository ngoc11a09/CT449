const { ObjectId } = require("mongodb");
const Book = require("../models/book.model");
class BookService {
  constructor(client) {
    this.book = client.db.collection("books");
  }
  //cac method
  filterUndefinedField(payload) {
    const book = { ...payload };
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }
  async create(payload) {
    const filtered_data = this.filterUndefinedField(payload);
    const instance = new Book(filtered_data);
    const result = await instance.save();

    return result;
  }

  async findAllBooks() {
    return await Book.find();
  }
  async findByCode(code) {
    const res = await Book.findOne({
      code: { $regex: new RegExp(code), $options: "i" },
    });
    return res;
  }
  async findByName(name) {
    return await Book.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    };
    const update = this.filterUndefinedField(payload);
    const result = await Book.findOneAndUpdate(filter, update, { new: true });
    return result;
  }

  async delete(id) {
    const result = await Book.deleteOne({
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await Book.deleteMany();
    return result.deletedCount;
  }
}

module.exports = BookService;
