const User = require("../models/User");
const Otp = require("../models/OtpmModals");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("../utils/sendOtpEmail"); // a utility to send OTP email
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/generateOtp");

// exports.signup = async (req, res) => {
//   try {
//     console.log('Signup Request Body:', req.body);

//     const { username, email, contactNumber, password } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       console.log('User already exists:', email);
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpires = Date.now() + 10 * 60 * 1000;

//     const user = new User({
//       username,
//       email,
//       contactNumber,
//       password: hashedPassword,
//       otp,
//       otpExpires,
//       isVerified: false,
//     });

//     await user.save();
//     console.log('User created successfully:', user);

//     try {
//       console.log('Sending OTP...');
//       await sendOtpEmail(email, otp);
//       console.log('OTP sent successfully to:', email);
//     } catch (emailError) {
//       console.error('Error sending OTP:', emailError);
//       return res.status(500).json({ message: 'Failed to send OTP' });
//     }

//     res.status(200).json({ message: 'OTP sent to email. Please verify.' });
//   } catch (error) {
//     console.error('Error in signup:', error);
//     res.status(500).json({ message: 'Error in signup', error });
//   }
// };

// exports.signup = async (req, res) => {
//   try {
//     const { username, email, contactNumber, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Generate OTP
//     // const otp = crypto.randomInt(100000, 999999).toString();
//     // const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

//     // Save OTP details in the OTP collection
//     // await Otp.findOneAndUpdate(
//     //   { email },
//     //   { email, otp, otpExpires },
//     //   { upsert: true, new: true }
//     // );
//     const existingOtp = await Otp.findOne(
//       { email },
//       { upsert: true, new: true }
//     );
//     // Send OTP to email

//     // if(!existingOtp) return res.status(404).json({success:false, message: 'Email already exists'})
//     try {
//       await sendOtpEmail(email);
//     } catch (error) {
//       return res.status(500).json({ message: "Failed to send OTP", error });
//     }
//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     console.log(hashedPassword, "mmmmmmmmmmmmmmmmmmmm");
//     // Generate JWT Token with additional details
//     const token = jwt.sign(
//       {
//         username,
//         email,
//         contactNumber,
//         password: hashedPassword, // Storing the hashed password
//       },
//       process.env.JWT_SECRET, // Secret key
//       { expiresIn: "1h" } // Token expiry
//     );
//     res
//       .status(200)
//       .json({ message: "OTP sent to email. Please verify.", token });
//   } catch (error) {
//     res.status(500).json({ message: "Error in signup", error });
//   }
// };

exports.signup = async (req, res) => {
  try {
    const { username, email, contactNumber, password } = req.body;
    console.log(req.body, ".............///////////////");

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = generateOtp(); // Generates a 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save OTP details in the OTP collection
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, otpExpires },
      { upsert: true, new: true }
    );

    // Send OTP to the user's email
    try {
      await sendOtpEmail(email, otp);
    } catch (error) {
      return res.status(500).json({ message: "Failed to send OTP", error });
    }

    // Hash the password for temporary storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate JWT Token for unverified user
    const secret = process.env.SECRET_KEY || "default_secret_key";
    console.log("JWT_SECRET:::::::::::::::::::::::", secret); // Log the secret to verify
    const token = jwt.sign(
      { username, email, contactNumber, hashedPassword, isVerified: false },
      secret,
      { expiresIn: "20m" }
    );

    res.status(200).json({
      message: "OTP sent to email. Please verify.",
      token,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Error in signup", error });
  }
};


// OTP Verification API
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     // Find user by email
//     const userData = await Otp.findOne({ email });
//     if (!userData) return res.status(400).json({ message: "User not found" });
//     console.log(userData, "user data");

//     // Check if OTP has expired
//     // if (user.otpExpires < Date.now()) {
//     //   return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
//     // }

//     // Check if OTP matches
//     if (userData.otp !== otp)
//       return res.status(400).json({ message: "Invalid OTP" });
//     console.log(otp, "//////////");
//     const hashedPassword = await bcrypt.hash(userData.password, 10);
//     // await user.save();
//     // Mark user as verified, clear OTP, and OTP expiration
//     userData.isVerified = true;

//     const newUser = new User({
//       username: userData.username,
//       email: userData.email,
//       contactNumber: userData.contactNumber,
//       password: hashedPassword,
//     });
//     await newUser.save();

//     userData.otp = undefined;
//     userData.otpExpires = undefined;

//     res.status(200).json({ message: "User successfully registered" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: "Error in OTP verification",
//         error: error.message || error,
//       });
//   }
// };


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record for the email
    const otpData = await Otp.findOne({ email });
    if (!otpData) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    // Check if OTP has expired
    if (otpData.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Extract user details from the token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    console.log(token,"token in verifu request")

    let userData;
    try {
      userData = jwt.verify(token, process.env.SECRET_KEY);
      isVerified=true;
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token", error });
    };
    if (userData.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }
    
    // Create a new user
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      contactNumber: userData.contactNumber,
      password: userData.hashedPassword, // Use the hashed password from the token
    });
    await newUser.save();
    console.log(userData,"user in verif llllllllllrequest")

    // Clear OTP from the collection
    // await Otp.deleteOne({ email });
console.log("object deleted")
    // Generate a new JWT Token for the verified user
    const verifiedToken = jwt.sign(
      { username: userData.username, email: userData.email, contactNumber: userData.contactNumber, isVerified: true },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User successfully registered and verified",
      token: verifiedToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in OTP verification", error });
  }
};
