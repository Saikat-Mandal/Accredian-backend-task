const express = require("express")
require('dotenv').config()
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const authRoutes = require("./routes/auth")
const db = require("./models/user")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

// middlewares 
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
    cors({
      origin: "http://localhost:3000",
      methods:["GET" , "POST"],
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    })
  );
app.use("/auth" , authRoutes)


// connect to mysql database 
db.connect((err)=>{
    if(err)console.log("err occured connecting to db" + err.stack);
    console.log("Connected to database!");
    const initialQuery = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, username VARCHAR(255) UNIQUE, password VARCHAR(500),firstname VARCHAR(255) DEFAULT NULL, lastname VARCHAR(255) DEFAULT NULL) "
    db.query(initialQuery ,(err, result)=>{
        if(err)console.log(err);
        console.log("table created");
    })
});  



// server running 
const PORT = process.env.PORT || 4001
app.listen(PORT , ()=>console.log(`listening to port ${PORT}`))