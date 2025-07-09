const sendEmail = require('./sendEmail');
require('dotenv').config();

const sendVerificationEmail= async ({name,email,verificationToken,origin})=>{
    const verifyEmail=`${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}&email=${email}`;

    const message = `<p> Please click on the following link to verify your email <a href="${verifyEmail}"> Verify email </a> </p>`;

    return sendEmail({
        to:email,
        subject:'Verification email',
        html:`<h4> Hello ${name} </h4> <br>
                ${message}`
    });
}

module.exports=sendVerificationEmail;