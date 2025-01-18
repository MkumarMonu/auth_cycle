// import mongoose from "mongoose";
const mongoose = require('mongoose');

const dbConnection = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  .then(()=>{console.log("database connection established")})
  .catch((error)=>console.error("database connection error:", error));
};

module.exports = dbConnection;