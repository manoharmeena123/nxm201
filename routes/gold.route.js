const express = require("express")

const goldRouter = express.Router()

goldRouter.get("/",(req,res)=>{
    res.send("All the Gold")
})

module.exports = {
    goldRouter
}