const axios = require('axios');
const asyncHandler = require("express-async-handler");
const connection = require('../config/dbconnection');

// Function to generate a random OTP of a specified length
function generateRandomOTP(length) {
  const charset = '0123456789'; // You can customize this to include other characters if needed
  let OTP = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    OTP += charset[randomIndex];
  }
  return OTP;
}

const sendOTP = asyncHandler(async (req, res) => {  try {
    const { Mobile } = req.body;

    if (!Mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
    const OTPMessage = generateRandomOTP(6); // Generate a 6-digit random OTP
    const apiUrl = `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=1a2f3c57-2885-11e9-9ee8-0200cd936042&to=${Mobile}&from=SRIASS&templatename=SRIASS&var1=${OTPMessage}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response.data;

    if (responseData.Status === 'Success') {
        const squery = "INSERT INTO  tblOTPLog (mobile, otp) VALUES ('" + Mobile + "','" + OTPMessage + "')";
        const values = [Mobile, OTPMessage];
  
        connection.query(squery, values, (error) => {
          if (error) {
            console.error('Error inserting OTP into the database:', error);
          } else {
            res.status(200).json({ message: 'OTP sent sucessfully' ,status: 'success'});
          }
        });
  
        return true;
    } else {
      console.error('Error sending OTP:', responseData.Details);
      return false;
    }
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return false;
  }
}
);
const verifyOTP = asyncHandler(async (req, res) => {
  try {
      const { OTP, Mobile } = req.body;

      if (!OTP || !Mobile) {
          return res.status(400).json({ error: 'OTP and Email are required' });
      }

      const query = "SELECT COUNT(*) AS count FROM tblOTPLog WHERE mobile = ? AND otp = ? AND isexpired = 0";

      connection.query(query, [Mobile, OTP], (err, results) => {
          if (err) {
              console.error('Error executing the query:', err);
              return res.status(500).json({ error: 'Internal server error' });
          }

          // Assuming the query returns a count, you can check the count value here
          const count = results[0].count; // Access the count property

          if (count > 0) {
              // Update the record if OTP is verified
              const updateQuery = "UPDATE tblOTPLog SET isexpired = 1 WHERE mobile = ? AND otp = ?";
              connection.query(updateQuery, [Mobile, OTP], (updateErr) => {
                  if (updateErr) {
                      console.error('Error updating record:', updateErr);
                      return res.status(500).json({ error: 'Error updating record' });
                  }
                  return res.status(200).json({ message: 'OTP verified successfully', status: 'success' });
              });
          } else {
              return res.status(400).json({ error: 'Invalid OTP or email' });
          }
      });
  } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Error verifying OTP' });
  }
});
// Example usage:



module.exports = {sendOTP ,verifyOTP};