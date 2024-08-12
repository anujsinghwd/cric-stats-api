# Cricket Match Data Tracking API

## Overview

The Cricket Match Data Tracking API is designed to track cricket match data with fine-grained detail. It enables accurate ball-by-ball updates and manages match data, including:

- Creating and managing match details.
- Tracking ball-by-ball events (runs, no-balls, wide balls, fours, sixes).
- Maintaining statistics for batsmen and bowlers (runs scored, balls faced, strike rates, runs conceded, no-balls conceded, economy rates).
- Updating and reverting match data to ensure consistency.
- Providing comprehensive match details through a dedicated endpoint.

## Features

- **Match Management:** Create and update match details.
- **Ball Tracking:** Add and update ball-by-ball events.
- **Statistics Management:** Maintain and update individual batsman and bowler statistics.
- **Error Handling:** Robust error handling and data validation using Joi.
- **Documentation:** API documentation generated using apidoc.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/anujsinghwd/cric-stats-api
   cd cric-stats-api
   ```

2. **Install Dependencies**
  Make sure you have Node.js and npm installed. Then, run the following command to install all required dependencies:
   ```bash
   npm install
   ```

3. **Create a .env File**
  Create a .env file in the root directory of your project to configure environment variables. Example:
   ```bash
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/cricket-api
   ```

4. **Setup MongoDB**
  Ensure you have MongoDB running on your local machine or specify the connection string in the .env file.

## Scripts

- **Start the Application**
To start the application, use:
   ```bash
   npm start
   ```
- **Generate API Documentation**
To generate API documentation using apidoc, use:
   ```bash
   npm run apidoc
   ```
This will create the documentation in the apidoc/ directory.

- **Serve API Documentation**
To serve the generated API documentation with the Express app, make sure to include the following line in your app.js or server.js:
   ```bash
   app.use('/docs', express.static(path.join(__dirname, 'apidoc')));
   ```
You can access the documentation at http://localhost:3000/docs.

## API Endpoints

### Match Endpoints

- **Create a Match**
   ```bash
   POST /matches
   ```

**Request Body:**
   ```json
   {
      "striker": "Player Name",
      "nonStriker": "Player Name",
      "bowler": "Player Name",
      "over_str": 0
   }
   ```

### Ball Endpoints

- **Add a Ball**
```http
POST /balls
```
