import mongoose from "mongoose";
require("dotenv").config;

const dbUrl: string = process.env.MONGODB_URL || "";

//create mongo db connection and connect to remote mongodb database using mainly the link
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(
        `Database is connected successfully with ${data.connection.host}`
      );
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
