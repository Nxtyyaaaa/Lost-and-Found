const {createJWT,isTokenValid,attachCookiesToResponse} = require('./jwt');
const createTokenUser= require('./createTokenUser');
const checkPermissions=require('./checkPermissions');
const sendVerificationEmail = require('./sendVerificationEmail');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const createHash = require('./createHash');
const sendEmail = require('./sendEmail');
const {categories,branches,locations} = require('./data');

module.exports ={branches,sendEmail,createJWT,isTokenValid,attachCookiesToResponse,createTokenUser,checkPermissions,sendVerificationEmail,sendResetPasswordEmail,createHash,categories,locations};