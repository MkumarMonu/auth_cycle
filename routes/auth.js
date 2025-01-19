const express = require('express');
const { signup, verifyOtp } = require('../controllers/authController');
const { verifyToken } = require('../services/generateToken');
const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyToken, verifyOtp);

module.exports = router;
