import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config()

//create server
const port = process.env.PORT || 8000;
app.listen(port, () =>{
    console.log(`server is connected on port ${port}`);
    connectDB();
})
