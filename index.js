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
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

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
const swaggerSpec = swaggerjsdocs(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerSpec, {
    customCss:
    '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
customCssUrl: CSS_URL,
}));
app.use("/api/auth", authRoute);


/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: This API is used to register a new user
 *      description: The API collects JSON data from the frontend to register a new user.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fullname:
 *                              type: string
 *                              example: John Doe
 *                          phoneNumber:
 *                              type: string
 *                              example: 09074235666
 *                          email:
 *                              type: string
 *                              example: shazaniyu@example.com
 *                          accountBank:
 *                              type: string
 *                              example: access
 *                          country:
 *                              type: string
 *                              example: Nigeria
 *                          businessType:
 *                              type: string
 *                              example: Pure water
 *                          password:
 *                              type: string
 *                              example: shazaniyu2@
 *      responses:
 *          200:
 *              description: Success
 *          400:
 *              description: Bad Request
 */


/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: This API is used to log in a user
 *      description: Verifies user credentials.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: john.doe@example.com
 *                          password:
 *                              type: string
 *                              example: Password123
 *      responses:
 *          200:
 *              description: Login successful
 *          401:
 *              description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/:
 *  delete:
 *      summary: Deletes a user
 *      description: Deletes a user from the system.
 *      parameters:
 *          - in: query
 *            name: userId
 *            required: true
 *            schema:
 *              type: string
 *            description: The ID of the user to delete
 *      responses:
 *          200:
 *              description: User deleted successfully
 *          404:
 *              description: User not found
 */

/**
 * @swagger
 * /api/auth/message:
 *  post:
 *      summary: Sends an email message
 *      description: Sends an email to a specified recipient.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          recipient:
 *                              type: string
 *                              example: jane.doe@example.com
 *                          subject:
 *                              type: string
 *                              example: Hello!
 *                          body:
 *                              type: string
 *                              example: This is a test email.
 *      responses:
 *          200:
 *              description: Message sent successfully
 *          500:
 *              description: Internal server error
 */



app.get('/', (req, res)=>{
    res.send('4welcome to mail-crm server')
})



app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

module.exports = app