const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config()
const cookieParser =  require("cookie-parser");

app.use(cookieParser())

const {connection} = require("./confige/confige")
const {UserModel} = require("./models/user.model")
const {authenticate} = require("./middleware/authenticate")
const {userRouter} = require("./routes/user.route")
const {roleRouter} = require("./routes/role.route")
const {authorise} = require("./middleware/authorise")
const {goldRouter} = require("./routes/gold.route")
app.get("/",(req,res)=>{
  console.log(req.cookies)
  res.json("Welcome")

})

app.use("/user",userRouter)

app.use(authenticate)
app.use("/goldrate",goldRouter)
app.use("/userstats",roleRouter)
            

app.listen(process.env.port,async()=>{
   try {
      await connection 
   console.log("Connected to DB 8080")
   } catch (error) {
     console.log(error)
   }
  
})