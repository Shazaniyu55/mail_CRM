const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/userroutes");
const path = require('path');
const port  = 4200;
const swaggerjsdocs = require('swagger-jsdoc');
const swaggerui = require("swagger-ui-express")
require('dotenv').config();


const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title:" mail-crm",
            version:"1.0.0"
        },
        servers:[
            {
                url:'http://localhost:4200/'
            }
        ]
    },
    apis: ['./index.js']
}
const swaggerSpec = swaggerjsdocs(options);
// mongoose.connect(process.env.MONGODB_CONNECTION)
// .then(()=>{console.log("Database Connected")})
// .catch((err)=>{console.log(err)});

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
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerSpec));


app.use((req, res, next)=>{
    res.render('404')
})

app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

module.exports = app