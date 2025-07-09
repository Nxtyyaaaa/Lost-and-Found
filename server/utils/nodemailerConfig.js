require('dotenv').config();
module.exports={
    service:'Gmail',
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
    }
};