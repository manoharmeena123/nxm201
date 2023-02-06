const jwt = require("jsonwebtoken");
const fs = require("fs")
const express = require("express");


const app = express()

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  const data =JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
  if(data.includes(token)){
    res.send("Login again blacklistpart")
  }else{
  if (token) {
    const decoded = jwt.verify(token, "masai");
    console.log(decoded)
    if (decoded) {
   
            const userrole = decoded.role
            // console.log(userrole)
            req.headers.userrole = userrole
           next();
         } else {
           res.send("Please Login ,Error in Decoded part");
       }
       } else {
        res.send("Please Login !");
  }
}
}


module.exports = {
  authenticate
};
