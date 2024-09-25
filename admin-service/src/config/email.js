const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'unihimindu@gmail.com', 
    pass: 'lzax zxjr wnrw zwnv'  
  }
});



transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});


module.exports = transporter;