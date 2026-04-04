import mongoose from "mongoose";

let isConnected = false;
const connectToDB= async()=> {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed", error);
  }
};
module.exports = connectToDB