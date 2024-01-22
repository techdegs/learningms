import { app } from "./app";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

//create express server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is connected on port ${port}`);
  connectDB();
});

//Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLUDINARY_SECRET_KEY,
});
