const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

class AuthService {
  constructor(client) {
    // console.log("Service >>>> ", client);
    this.user = client.db.collection("users");
  }

  filterUndefinedField(payload) {
    const user = { ...payload };
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async find(filter) {
    const cursor = await this.user.find(filter);
    return await cursor.toArray();
  }

  async findByUsername(username) {
    return await this.find({
      username: { $regex: new RegExp(username) },
    });
  }

  async findById(id) {
    return await this.user.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(`${id}`) : null,
    });
  }

  async create(payload) {
    const { username, password } = payload;

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      password: hashedPass,
    });
    console.log("saveuser: ", newUser.save);
    const savedUser = await newUser.save();
    const token = jwt.sign(savedUser, "tokensecret");
    return savedUser;
  }
}

module.exports = AuthService;
