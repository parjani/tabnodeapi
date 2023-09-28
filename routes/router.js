const express = require('express');
const authenticateApiKey = require('../config/authMiddleware');

const { getList } = require('../controllers/sample');
const { sendOTP, verifyOTP } = require('../controllers/sampleotp');
const { sendOTPEmail} = require('../controllers/sampleemailotp');

const router = express.Router();
router.use(authenticateApiKey);

router.get("/getlist", getList);
router.post("/sendOTP", sendOTP);
router.post("/sendOTPtoEmail", sendOTPEmail)
router.post("/verifyOTP", verifyOTP)
//router.post("/verifyOTP", verifyOTP)










module.exports = router;
