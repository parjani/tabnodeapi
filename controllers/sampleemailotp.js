const sgMail = require('@sendgrid/mail');
const asyncHandler = require("express-async-handler");
const connection = require('../config/dbconnection');


sgMail.setApiKey('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');

function generateRandomOTP(length) {
    const charset = '0123456789'; // You can customize this to include other characters if needed
    let OTP = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      OTP += charset[randomIndex];
    }
    return OTP;
  }
  
  const sendOTPEmail = asyncHandler(async (req, res) => {  
    try {
      const { Email } = req.body; // Assuming the email address is provided in the request body
  
      if (!Email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const OTPMessage = generateRandomOTP(6);
      const msg = {
        to: Email,
        from: 'admin@shubhraranjan.com', // Replace with your email address
        subject: 'OTP for EmailID', // Replace with a specific subject
        html: `This is your generated OTP: <strong>${OTPMessage}</strong>`,
      };
  
      const response = await sgMail.send(msg);
  
      if (response[0].statusCode === 202) {
        const squery = `INSERT INTO tblOTPLogemail (email, otp) VALUES (?, ?)`;
        const values = [Email, OTPMessage];
  
        connection.query(squery, values, (error) => {
          if (error) {
            console.error('Error inserting OTP into the database:', error);
            res.status(500).json({ error: 'Error inserting OTP into the database' });
          } else {
            res.status(200).json({ message: 'OTP sent successfully', status: 'success' });
          }
        });
      } else {
        console.error('Error sending OTP:', response);
        res.status(500).json({ error: 'Error sending OTP' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  });
 

// const verifyOTP = asyncHandler(async (req, res) => {
//     try {
//         const { OTP, Email } = req.body;

//         if (!OTP || !Email) {
//             return res.status(400).json({ error: 'OTP and Email are required' });
//         }

//         const query = "SELECT COUNT(*) AS count FROM tblOTPLogemail WHERE email = ? AND otp = ? AND isexpired = 0";

//         connection.query(query, [Email, OTP], (err, results) => {
//             if (err) {
//                 console.error('Error executing the query:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             // Assuming the query returns a count, you can check the count value here
//             const count = results[0].count; // Access the count property

//             if (count > 0) {
//                 // Update the record if OTP is verified
//                 const updateQuery = "UPDATE tblOTPLogemail SET isexpired = 1 WHERE email = ? AND otp = ?";
//                 connection.query(updateQuery, [Email, OTP], (updateErr) => {
//                     if (updateErr) {
//                         console.error('Error updating record:', updateErr);
//                         return res.status(500).json({ error: 'Error updating record' });
//                     }
//                     return res.status(200).json({ message: 'OTP verified successfully', status: 'success' });
//                 });
//             } else {
//                 return res.status(400).json({ error: 'Invalid OTP or email' });
//             }
//         });
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         res.status(500).json({ error: 'Error verifying OTP' });
//     }
// });



  
module.exports = { sendOTPEmail };