const { ObjectId } = require("mongodb");

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
    const result = await this.book.insertOne(filtered_data);

    return result;
  }

  async find(filter) {
    const cursor = await this.book.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    };
    const update = this.filterUndefinedField(payload);
    const result = await this.book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.book.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
