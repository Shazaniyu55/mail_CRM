const Payment = require('../model/payment');
const User = require("../model/user");
const Subscribe = require('../model/subscribe');
const axios = require("axios");
require("dotenv").config();



const subscriptionFee = async (req, res) => {
  const { email, name, package, userId } = req.body;

  const paymentData = {
    public_key: process.env.PUBLIC_KEY,
    email: email,
    name: name,
    subscription: package,
    currency: 'NGN',
    source: 'docs-html-test',
    user: userId,
    amount: package 
  };

  try {
    // Make the API request to Paystack
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      amount: package * 100,
      currency: 'NGN',
      callback_url: `http://localhost:3500/api/payment/verify-payment?userId=${userId}`,
      email: email,
      name: name,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRETE_LIVE}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status) {
      const paymentLink = response.data.data.authorization_url; // This link is where you should redirect the user to
      const tx_ref = response.data.data.reference; // Use the Paystack reference as tx_ref

      // Update paymentData to include the tx_ref from Paystack
      paymentData.tx_ref = tx_ref;

      // Save the payment data to your database
      const payment = new Subscribe(paymentData);
      await payment.save();
      
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('Error preparing payment redirect:', error);
    res.status(500).json({ success: false, message: 'Failed to prepare payment redirect' });
  }
};


const verifyPayment = async (req, res) => {
  const { trxref, reference, userId } = req.query;

  if (!trxref || !reference || !userId) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const payment = await Subscribe.findOne({ user: userId });

    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found' });
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record



    // Update payment status and points
    await Subscribe.findOneAndUpdate({ tx_ref: trxref }, { status: 'success', points: points });

    res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

const withdraw = async (req, res) => {
  const { userId, amount, bank_code, account_number, account_name } = req.body;
  console.log(bank_code, userId, amount, account_name, account_number);
  if (!userId || !amount  || !bank_code || !account_number || !account_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the withdrawal amount is within the user's commission
    if (amount > user.commissions) {
      return res.status(400).json({ message: 'Insufficient commission' });
    }



  const payload = {
      
        "bank_code": `${bank_code}`,
        "country_code": "NG",
        "account_number": `${account_number}`,
        "account_name": `${account_name}`,
        "account_type": "personal",
        "document_type": "identityNumber",
        "document_number": "76147241785"

    }

    // const response = await flw.Transfer.initiate(payload)
    const response = await axios.post('https://api.paystack.co/bank/validate', payload, {
      headers: {
              Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
              'Content-Type': 'application/json'
            }
    })

    console.log(response);
} catch (error) {
    console.log(error)
    res.status(400).json({status: "failed", message: "verification failed"})

}


  

};



const submitPayment = async (req, res) => {
  const { email, name, amount, userId } = req.body;
  console.log(email, name, amount, userId)

  // Generate a unique transaction reference
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomValue = Math.floor(Math.random() * 1000000); // Random number up to 1,000,000
  const tx_ref = `tx_${timestamp}_${randomValue}`; // Combine timestamp and random value

  // Payment data
  const paymentData = {
    public_key: process.env.PUBLIC_KEY,
    email: email,
    name: name,
    tx_ref: tx_ref,
    amount: amount,
    currency: 'NGN',
    source: 'docs-html-test',
    status: 'pending', // Default status
    user: userId
  };

  try {
    // Save the payment record to the database
    const payment = new Payment(paymentData);
    await payment.save();
    await User.findByIdAndUpdate(userId, {
               $push: { payments: payment._id }
         });
      

    // Make the API request to Flutterwave
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      tx_ref: tx_ref,
      amount: amount,
      currency: 'NGN',
      callback_url: `http://localhost:3500/api/auth/dashboard/${userId}`,   
        email: email,
        name:name,
        phonenumber: '09012345678'
      
     
   
    }, {
      headers: {
        Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === true) {
      const paymentLink = response.data.data.link; // This link is where you should redirect the user to
      await Payment.updateOne({ status: 'success' });
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      // Handle unsuccessful response
      await Payment.updateOne({ status: 'failed' });

      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }
  } catch (err) {
    console.error('Error processing payment:', err.response ? err.response.data : err.message);
    // Update payment status to failed
    await Payment.updateOne({ tx_ref: tx_ref }, { status: 'failed' });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




const verifyUpgradePayment = async (req, res) => {
  const { tx_ref, userId, reference } = req.query;
 

  if (!tx_ref || !userId || !reference) {
    //return res.status(400).json({ success: false, message: 'Missing required parameters' });
    return  res.render('paymentunsuccess', {userId})

  }




  try {
    // Fetch the payment record from the database
    const payment = await Upgrade.findOne({ tx_ref: tx_ref });
    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment record not found' });
    }

    const expectedAmount = payment.amount; // Retrieve the expected amount from the payment record
    console.log(expectedAmount)
    const points = packagePoints[expectedAmount] || 0;

    // Verify the transaction using Flutterwave
    //const response = await flw.Transaction.verify({ id: transaction_id });
    //console.log(response)



    if (response.data.status === 'successful' &&
        response.data.amount === expectedAmount &&
        response.data.currency === 'NGN') {

      // Payment was successful, update the payment status
      await Upgrade.updateOne({ tx_ref: tx_ref }, { status: 'success' });
      await Upgrade.updateOne({ points: points})
      await upgradeDisribution(userId, expectedAmount);
      // Optionally, update other related records or perform additional actions

      //res.redirect(`http://localhost:3500/api/auth/dashboard/${userId}`);
      res.render('paymentsuccess', {userId})
    } else {
      // Payment failed or does not match the expected parameters
      await Upgrade.updateOne({ tx_ref: tx_ref }, { status: 'failed' });
      //res.status(400).json({ success: false, message: 'Payment verification failed' });
      res.render('paymentunsuccess', {userId})

    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

const upgradePackage = async (req, res) => {

  const { email, name, package, userId} = req.body;
  console.log("Upgrade package request received", req.body);
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomValue = Math.floor(Math.random() * 1000000); // Random number up to 1,000,000
  const tx_ref = `tx_${timestamp}_${randomValue}`; // Combine timestamp and random value

  const points = packagePoints[package] || 0;


  const paymentData = {
      public_key: process.env.PUBLIC_KEY,
      email: email,
      amount: package,
      name: name,
      tx_ref: tx_ref,
      subscription: package,
      currency: 'NGN',
      source: 'docs-html-test',
      user:userId
  };



  try {


       // Make the API request to Flutterwave
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      tx_ref: tx_ref,
      amount: package,
      currency: 'NGN',
      callback_url: ``,
      email: email,
      name: name,
      
     
   
    }, {
      headers: {
        Authorization: `Bearer sk_test_0ef643074c6e99bb5e115e092a4bb495a5b63005`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === true) {
      const paymentLink = response.data.data.link; // This link is where you should redirect the user to
      // Create a new payment record
      const payment = new Upgrade(paymentData);
      await payment.save();

      //distribute commission for upgrade...
      //distributeCommissions(userId, package)
      res.redirect(paymentLink); // Redirect user to the payment page
    } else {
      // Handle unsuccessful response
      await Subscribe.updateOne({ status: 'failed' });

      res.status(400).json({ success: false, message: 'Payment initialization failed' });
    }


 

  } catch (error) {
      console.error('Error preparing payment redirect:', error);
      res.status(500).json({ success: false, message: 'Failed to prepare payment redirect' });
  }
};




module.exports = 
{
  withdraw,
  submitPayment, 
  subscriptionFee, 
  upgradePackage,
  verifyPayment,
  verifyUpgradePayment,
 
}
