const db = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuid } = require('uuid');
const salt = 10



// register controller 
exports.registerController = (req,res)=>{
    try {
        const {username , email , password , firstname ,lastname } = req.body

        db.query("SELECT * FROM users where username = ? or email = ?", [username , email] , (err,results)=>{
            if(err){
                return res.status(300).json({message : "Error finding the user !"})
            }
            else if(results.length > 0){
                return res.status(300).json({message : "User already exists !"})
            }
            else{
                const hashedPassword = bcrypt.hashSync(password , salt)

                db.query("INSERT into users (username , email , password , firstname , lastname) VALUES (?,?,?,?,?)" , 
                [username , email , hashedPassword , firstname , lastname] , (err, result)=>{
                    if(err) return res.status(500).json({message : "Error while registering the user !"})
                    return res.status(200).json({result , message : "User created !"})
                })
            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// login controller 
exports.loginController = (req,res)=>{
    
    try {
        const { usernameOrEmail , password} = req.body

        db.query("SELECT * FROM users WHERE username = ? or email = ?" , [usernameOrEmail , usernameOrEmail] , (err, results)=>{
            if(err){
                return res.status(300).json({message : "Error finding the user !"})
            }
            else if(results.length > 0){
                const user = results[0]

                const isPasswordCorrect = bcrypt.compareSync(password , user.password)
                
                if(!isPasswordCorrect){
                    return res.status(300).json({message :"Passwords do not match !"})
                }

                const token = jwt.sign({id : user.username} , process.env.JWT_SECRET)

                res.cookie("jwt", token, {
                    withCredentials: true,
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({ token, username: user.username , message : "User logged in !" });
            }
            else{
               return res.status(300).json({message : "Invalid credentials !"})
            }
        })

        

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// logout controller 
exports.logoutContoller =(req,res)=>{
    try {
        res.cookie("jwt", "", {
            expires: new Date(0),
            httpOnly: true,
          });
          res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}