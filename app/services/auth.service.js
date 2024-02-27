const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const moment = require("moment");
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
    const res = await this.find({
      username: { $regex: new RegExp(username) },
    });
    if (res.length == 0) return null;
    return res;
  }
  async _generateUserCode() {
    let code = await this.user.count();
    return "U" + code.toString().padStart(6, "0");
  }
  async create(payload) {
    payload.username = payload.username.trim();
    payload.password = await bcrypt.hash(payload.password, 10);
    payload.birthday = moment(payload.birthday, "DD/MM/YYYY");
    payload.code = await this._generateUserCode();

    const instance = new User(payload);

    const token = jwt.sign(
      {
        role: instance.role,
        username: instance.username,
        email: instance.username,
        code: instance.code,
      },
      "JWT_SECRET"
    );
    const RF = jwt.sign({ id: instance.code }, "sdalaskjdlk");

    instance.refreshToken = RF;
    await instance.save();
    return { token };
  }
}

module.exports = AuthService;
