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
                url:'https://mail-crm.vercel.app/'
            }
        ]
    },
    apis: ['./index.js']
}

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
const swaggerSpec = swaggerjsdocs(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerSpec));
app.use("/api/auth", authRoute);



/**
 * @swagger
 * https://mail-crm.vercel.app/api/auth/register:
 *  post:
 *      summary: This api is used to register a new user
 *      description: The api  collects json data from the frontend.
 *      responses:
 *              200:
 *                  description: Success
 *      parameters:
 *                 firstname, lastname
 *                      
 *                      
 *                 
 */


/**
 * @swagger
 * https://mail-crm.vercel.app/api/auth/login:
 *  post:
 *      summary: This api is used to check if get method is working
 *      description: This api is used to check if get method is working
 *      responses:
 *              200:
 *                  description: To test the GET
 */

/**
 * @swagger
 * https://mail-crm.vercel.app/api/auth/:
 *  delete:
 *      summary: This api is used to check if get method is working
 *      description: This api is used to check if get method is working
 *      responses:
 *              200:
 *                  description: To test the GET
 */



/**
 * @swagger
 * https://mail-crm.vercel.app/api/auth/message:
 *  post:
 *      summary: This api is used to send email message 
 *      description: This api is used to check if get method is working
 *      responses:
 *              200:
 *                  description: To test the GET
 */


app.get('/', (req, res)=>{
    res.send('4welcome to mail-crm server')
})



app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

module.exports = app