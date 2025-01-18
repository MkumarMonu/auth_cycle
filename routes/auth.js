const express = require('express');
const { signup, verifyOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);

module.exports = router;
