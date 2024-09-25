const {transporter} = require('../config/email');

const sendEmail = async (to, subject, text, html) => {
    try {
      let info = await transporter.sendMail({
        from: '"PointMaster" pointmaster@gmail.com>', 
        to: to, 
        subject: subject, 
        text: text,
        html: html
      });
  
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
};


module.exports = {sendEmail};