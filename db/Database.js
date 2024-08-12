const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connection = null;
  }

  async connect(uri, options = {}) {
    if (this.connection) {
      console.log("Already connected to the database.");
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(uri, {
        ...options,
      });

      console.log("Connected to the database.");
      return this.connection;
    } catch (err) {
      console.error("Database connection error:", err);
      throw err;
    }
  }

  async disconnect() {
    if (!this.connection) {
      console.log("No database connection to close.");
      return;
    }

    try {
      await mongoose.disconnect();
      console.log("Disconnected from the database.");
      this.connection = null;
    } catch (err) {
      console.error("Error disconnecting from the database:", err);
      throw err;
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();
