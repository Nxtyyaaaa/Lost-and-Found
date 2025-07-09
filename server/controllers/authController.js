const User = require('../models/User');
const CustomError = require('../errors');
const {sendVerificationEmail, createTokenUser, attachCookiesToResponse, sendResetPasswordEmail} = require('../utils');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');
const Token = require('../models/Token');
const {createHash} = require('../utils');

const register = async(req,res)=>{
    const {name,email,password} = req.body;
    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists){
        throw new CustomError.BadRequestError(`User already exists with email : ${email}`);
    }

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({name,email,password,verificationToken});

    await sendVerificationEmail({name,email,verificationToken})

    res.status(StatusCodes.CREATED).json({msg:'Success!! Please verify your email account'});
}

const verifyEmail = async(req,res)=>{
    const {token,email} = req.query;
    const user = await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError('Verification failed');
    }

    if(user.verificationToken !== token){
        throw new CustomError.UnauthenticatedError('Verification failed');
    }

    user.isVerified= true;
    user.verificationToken='';
    user.verified= Date.now();

    await user.save();

    res.status(StatusCodes.OK).json({msg:'Email verified!! Login again'});
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new CustomError.BadRequestError(`Please provide email and password`);
    }
    const user = await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError(`No user exists with email : ${email}`);
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError(`Wrong password entered!!`);
    }

    if(!user.isVerified){
        throw new CustomError.UnauthenticatedError(`Please verify your email`);
    }

    const tokenUser = createTokenUser(user);

    let refreshToken = '';
    const existingToken = await Token.findOne({user:user._id});
    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new CustomError.UnauthenticatedError('Unable to Login');
        }

        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({res,user:tokenUser,refreshToken});
        res.status(StatusCodes.OK).json({
            user:tokenUser
        });
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    const userToken = {refreshToken,ip,userAgent,user:user._id};
    await Token.create(userToken);

    attachCookiesToResponse({res,user:tokenUser,refreshToken});

    res.status(StatusCodes.OK).json({user:tokenUser});
}

const logout = async(req,res)=>{
    await Token.findOneAndDelete({user:req.user.userId});

    res.cookie('accessToken','logout',{
        httpOnly:true,
        expires : new Date(Date.now()),
    })

    res.cookie('refreshToken','logout',{
        httpOnly:true,
        expires : new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({msg:"user logged out"});
}

const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        throw new CustomError.BadRequestError(`Please provide email`);
    }
    const user = await User.findOne({email});

    if(user){
        const passwordToken =crypto.randomBytes(70).toString('hex');

        await sendResetPasswordEmail({name:user.name,email:user.email,token:passwordToken});

        const tenMinutes = 10*60*1000;
        const passwordTokenExpirationDate = new Date(Date.now()+tenMinutes);
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
    }
    res.status(StatusCodes.OK).json({msg:"Check email for password reset link"});
}

const resetPassword = async(req,res)=>{
    const{email,token,password}= req.body;
    if(!email || !token || !password){
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({email});
    
    if(user){
        const currentDate = new Date();
        if(user.passwordToken===createHash(token) && user.passwordTokenExpirationDate>currentDate){
            user.password=password;
            user.passwordToken=null;
            user.passwordTokenExpirationDate=null;
            await user.save();
        }
        console.log("I was here");
    }
    res.status(StatusCodes.OK).json({msg:"Successful password reset"});
}

module.exports = {register,login,verifyEmail,forgotPassword,resetPassword,logout};