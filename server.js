const config = require("./app/config");
const app = require("./app");
const MongoDB = require("./app/utils/mongodb.util");
const mongoose = require("mongoose");

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.log("fail to connect to the db", error);
    process.exit();
  }
}

startServer();
