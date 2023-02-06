

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const fs = require("fs")
const {UserModel} = require("../models/user.model")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()
const cookieparser = require("cookie-parser")
userRouter.use(cookieparser())

//Register===================================================================>

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,role} = req.body
    const user =await UserModel.findOne({email})

    if(user){
        res.json("Already exist,Please login")

    }else{
        try {
            bcrypt.hash(password,5,async(err,hash)=>{
                const user = new UserModel({name,email,password:hash,role})
               await user.save()
               res.json("Hurray ,User signup Successfully !")
            }) 
        } catch (error) {
            res.json("Error in Signup")
            console.log(error)
        }
    }


})

//Login====================================================================>

userRouter.post("/login",async(req,res)=>{
    const {email,password}= req.body
    
try {
    const user =await UserModel.findOne({email})
 
    if(user){
        const hashed_pass = user.password
        bcrypt.compare(password,hashed_pass,(err,result)=>{
            if(result){

                const token = jwt.sign({"userID":user._id,role:user.role},'masai',{expiresIn:60})
                const refreshtoken = jwt.sign({"userID":user._id,role:user.role},'kasai',{expiresIn:300})
                res.cookie("token",token,{httpOnly:true,maxAge:1000000}).cookie("refreshtoken",refreshtoken,{httpOnly:true,maxAge:1000000})
             res.json({"msg":"Login Successfully","token":token,"refreshtoken":refreshtoken})
          
            }else{
                res.json({"msg":"Login Failed"})
            }
        })
    }else{
        res.json({"msg":"Result Not Correct"})
        console.log(err)
    }
} catch (error) {
   
    console.log(error)
    res.send({"msg":"Login failed Error in try"})
}   
 })




 //NEWToken =====================================================================================>

userRouter.post("/newtoken",(req,res)=>{
const refreshtoken = req.cookies.refreshtoken
if(refreshtoken){
    const decode = jwt.verify(refreshtoken,'kasai')
const token = jwt.sign({"userID":decode.userID,},'kasai',{expiresIn:"1h"})
res.cookie("token",token,{httpOnly:true,maxAge:1000000}).cookie("refreshtoken",refreshtoken,{httpOnly:true,maxAge:1000000})
res.json({"msg":"New Token Generated","token":token})

}else{
    res.json({"msg":"Invalid refresh Token "})
}


})

//Logout==========================================================================================>

userRouter.get("/logout",(req,res)=>{
    const token = req.cookies.token
    try {
        const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
        blacklisteddata.push(token)
        fs.writeFileSync("./blacklist.json",JSON.stringify(blacklisteddata))
         res.clearCookie("token").clearCookie("refreshtoken")
        res.json({"msg":"Logout Successfully"})
    } catch (error) {
        res.json({"msg":"Error in Logout"})
    }

})





module.exports ={
    userRouter
}










/////////////////////////////////////////////////////////////////////////////




// const express = require('express');
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
// const app = express();

// // Dummy database for storing user email and hashed password
// const users = [
//   {
//     email: 'user1@example.com',
//     password: '$2b$10$bVmGnE/tYzQRm/dxte/Qx.9iD/txAe1G/L1ZN/SoNif5Ymg/Nv/Ii'
//   },
//   {
//     email: 'user2@example.com',
//     password: '$2b$10$5YcxKx9aJ0b1q.pvLrCrleMh1kKdYtA0RtCfT/732nX/lTl8cJfTK'
//   }
// ];

// // Route for handling login form submission
// app.post('/login', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   // Find user in the database
//   const user = users.find(u => u.email === email);
//   if (!user) {
//     return res.status(401).send('Email not found');
//   }

//   // Compare entered password with stored password hash
//   bcrypt.compare(password, user.password, (err, isMatch) => {
//     if (err) {
//       return res.status(500).send('Server error');
//     }
//     if (!isMatch) {
//       return res.status(401).send('Incorrect password');
//     }

//     // Generate and store OTP in the database
//     const otp = Math.floor(Math.random() * 1000000);
//     user.otp = otp;

//     // Send OTP to user's email
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.example.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: 'noreply@example.com',
//         pass: 'secret'
//       }
//     });
//     transporter.sendMail({
//       from: 'noreply@example.com',
//       to: email,
//       subject: 'Login OTP',
//       text: `Your OTP is: ${otp}`
//     });

//     return res.status(200).send('OTP sent');
//   });
// });

// // Route for handling OTP verification
// app.post('/verify-otp', (req, res) => {
//   const email = req.body.email;
//   const otp = req.body.otp;

//   // Find user in the database
//   const user = users.find(u => u.email === email);
//   if (!user) {
//     return res.status(401).send('Email not found');
//   }

//   // Compare entered OTP with stored OTP
//   if (user.otp !== otp) {
//     return res.status(401).send('Incorrect OTP