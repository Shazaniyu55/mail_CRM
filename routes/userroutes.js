//my express server imports
const express = require('express');
const router = express.Router();
const multer = require("multer");

//all my controller imports 
const 
{

    logIn, 
    signUp, 
    message,
    firebaseLogin,
 
    
} = require("../controller/usercontroller");


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

//all my routes



//authentication api routes
router.post("/register",signUp);
router.post("/login", logIn);
router.post("/message", message);
router.post('/firebase-login', firebaseLogin)






module.exports = router