const nodemailer = require('nodemailer');
const generateOtp = require('./generateOtp');

const sendOtpEmail = async (email,otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host:"smtp.gmail.com",
      service: 'Gmail',
      secure:true,
      port:465,
      auth: {
        user: "monucs154@gmail.com",
        pass: "wixyhvtzmomiurpt"
      }
    });

  //  const otp = generateOtp();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };
    console.log(email,"mao;",process.env.EMAIL_USER, otp)
    console.log(email,"mao;kkkkkkkkkk")

    await transporter.sendMail(mailOptions);
    console.log(process.env.EMAIL_USER,"bbbbbbbb")

    console.log('OTP email  sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Could not send OTP email');
  }
};

module.exports = sendOtpEmail;
