require("dotenv").config();
const server = require("./app.js");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

// listen server and connect to database
const main = async () => {
  console.log("db connecting...");
  // Connect to database
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: process.env.DB_NAME,
  });
  console.log("db connected");
  server.listen(port, () => {
    console.log(`server is running on port: ${port}....`);
  });
};

main();
