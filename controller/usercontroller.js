const User = require("../model/user");


//function to login
const logIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: "Failed", message: "invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, 'Adain', { expiresIn: '1h' }); // 1 hour expiration
        // const token = user.generateAuthToken();
        //res.status(200).json({ status: "Success" });
        // Store user information in the session
    
                req.session.user = {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname, 
                    phoneNumber: user.phoneNumber,
                    country: user.country,
                    
                    accountBank: user.accountBank,
                    
                   
                   
                    
                   
                    
                    // Add other fields as needed
                };

                // Send success response
                res.status(200).json({
                    status: "Success",
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        fullname: user.fullname,
                        phoneNumber: user.phoneNumber,
                        country: user.country,
                       
                        accountBank: user.accountBank,
                        

                    }
                });
        
                // Redirect to the dashboard
                // res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during login:", error);

        // Handle errors and ensure only one response
        if (!res.headersSent) {
            res.status(500).json({ status: "Failed", message: error.message });
        }   
    }
    
    
};



module.exports ={logIn}
