const jwt = require("jsonwebtoken");
const signUp = require("../models/signupSchema");

const auth = async (req, res, next) => {
  try {
    const usertoken = req.cookies.loginSignupToken;

    const verify = jwt.verify(usertoken, process.env.SECRET_KEY);
  
    const userdata = await signUp.findOne({ _id: verify._id });
 
    req.usertoken = usertoken;
    req.userdata = userdata;

    next();
  } catch (error) {
    

    res.redirect("/loginSignup");
  }
};

module.exports = auth;
