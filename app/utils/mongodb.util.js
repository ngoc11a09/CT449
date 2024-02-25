const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

// class MongoDB {
//   static connect = async (uri) => {
//     try {
//       if (this.client) return this.client;
//       this.client = await MongoClient.connect(uri);
//       console.log("Connected to database");
//       return this.client;
//     } catch {
//       throw new Error("Fail!");
//     }
//   };
// }

class Mongoose {
  static connect = async (uri) => {
    try {
      if (this.client) return this.client;
      this.client = await mongoose.connect(uri);
      this.client = this.client.connection;
      // console.log(this.client.connection.client);
      console.log("Connected to database");
      return this.client;
    } catch {
      throw new Error("Fail!");
    }
  };
}

module.exports = Mongoose;
