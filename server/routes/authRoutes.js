const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication');
const crypto = require('crypto');
const User = require('../models/User');

const {login,register,resetPassword,verifyEmail,forgotPassword,logout} = require('../controllers/authController');
const passport = require('passport');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const Token  = require('../models/Token');
const CustomError = require('../errors');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/verify-email').get(verifyEmail);
router.route('/logout').delete(authenticateUser,logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',passport.authenticate('google',{
    failureRedirect : 'http://localhost:5173/login'}), /* **CORRECT THIS */
    async (req,res)=>{
        try {
            // console.log("Hello1");
            let token = await Token.findOne({user:req.user._id});
            // console.log(req.user);
            if(!token){

                const newRefreshToken=crypto.randomBytes(40).toString('hex');
                const userAgent = req.headers['user-agent'];
                const ip=req.ip;
                const userToken = {refreshToken:newRefreshToken,ip,userAgent,user:req.user._id};
            
                token = await Token.create(userToken);
            }
            // console.log("Hello2");
            const user = await User.findOne({_id:req.user._id});
            user.isVerified=true;
            await user.save();
            // console.log("Hello3");
            const refreshToken = token.refreshToken;
            const tokenUser = createTokenUser(req.user);
            attachCookiesToResponse({res,user:tokenUser,refreshToken});
            // console.log("Here I am");
            return res.redirect('http://localhost:5173/');//?? **CORRECT THIS**
        } catch (error) {
            throw new CustomError.UnauthenticatedError('Unable to Login');
        }
}) 
// check for failure redirect correctly, is correct in integrated, but may cause error in testing on different ports


module.exports = router;