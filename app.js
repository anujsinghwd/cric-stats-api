// app.js
const express = require('express');
const Database = require('./db/Database');
const matchRoutes = require('./routes/match.routes');
const BallRoutes = require('./routes/ball.routes');

class App {
  constructor() {
    require('dotenv').config();
    this.app = express();
    this.database = Database;
    this.port = process.env.PORT || 3000;

    // Initialize app components
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  // Middleware initialization
  initializeMiddlewares() {
    this.app.use(express.json());
    this.initializeLogger();
  }

  initializeLogger() {
    this.app.use((req,res,next) =>{
      req.time = new Date(Date.now()).toString();
      console.log(req.method,req.hostname, req.path, req.time);
      next();
    });
  }

  // Route initialization
  initializeRoutes() {
    this.app.use('/api/matches', matchRoutes);
    this.app.use('/api/balls', BallRoutes);
  }

  // Database connection
  async initializeDatabase() {
    const dbUri = process.env.MONGO_URI;
    try {
      await this.database.connect(dbUri);
    } catch (err) {
      console.error('Failed to connect to the database. Server not started.');
      process.exit(1);
    }
  }

  // Start the server
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  // Graceful shutdown
  async shutdown() {
    await this.database.disconnect();
    process.exit(0);
  }
}

// Instantiate and start the app
const appInstance = new App();
appInstance.start();

// Handle graceful shutdown on termination signals
process.on('SIGINT', () => appInstance.shutdown());
process.on('SIGTERM', () => appInstance.shutdown());

module.exports = appInstance;
