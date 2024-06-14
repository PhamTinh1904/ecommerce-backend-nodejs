"use strict";

const mongoose = require("mongoose");
const { countConnections } = require("../helpers/check.connect.js");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;
console.log(connectString);
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose
      .connect(connectString)
      .then((_) =>
        console.log(`Connect Mongodb Success Pro`, countConnections())
      )
      .catch((err) => console.log(`Error Conect`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
