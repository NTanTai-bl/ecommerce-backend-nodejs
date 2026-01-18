const mongoose = require("mongoose");
const connectString =
  "mongodb+srv://tainguyen_db_user:a2L4KZ9DSz5bjRmG@cluster0.oicjubc.mongodb.net/dev?retryWrites=true&w=majority&appName=Cluster0";

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => console.log("Connect to database"))
      .catch((e) => console.log("Error to connect database", e));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
