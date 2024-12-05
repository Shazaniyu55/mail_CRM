const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/userroutes");

const port  = 4200;
require('dotenv').config();


mongoose.connect(process.env.MONGODB_CONNECTION)
.then(()=>{console.log("Database Connected")})
.catch((err)=>{console.log(err)});

app.use(session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, }
    
}));

//parses data  to json
//app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api/auth", authRoute);

app.use((req, res, next)=>{
    res.render('404')
})

app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

module.exports = app