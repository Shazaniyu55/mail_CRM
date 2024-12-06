const express = require('express');
const router = express.Router();
const 
{
    submitPayment, 
    subscriptionFee,
    
    withdraw,
   
    upgradePackage,
    verifyPayment,
    verifyUpgradePayment,
} = require("../controller/payment");
//const authenticate = require("../util/auth.middleware");

router.post("/banktransfer", submitPayment);
router.post("/withdraw", withdraw);
router.post("/subscription", subscriptionFee);
router.post('/niyuupgrade', upgradePackage);

router.get('/verify-payment', verifyPayment);
router.get('/verify-upgrade-payment', verifyUpgradePayment);


module.exports = router