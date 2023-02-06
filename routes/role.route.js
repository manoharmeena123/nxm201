const express = require('express')
const roleRouter = express.Router()
const jwt = require("jsonwebtoken")
const {authorise} = require("../middleware/authorise")



// manager && worker
roleRouter.get("/buyProduct",authorise(["manager","worker"]),(req,res)=>{
    res.send("You can buy Products")
})


//manager
roleRouter.get("/editProduct",authorise(["manager"]),(req,res)=>{
    res.send("You can Edit Products")
})
  
//workers
roleRouter.get("/reviewProduct",authorise(["worker"]),(req,res)=>{
    res.send("You can buy and add  ")
})


module.exports ={
    roleRouter
}