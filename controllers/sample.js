const asyncHandler = require("express-async-handler");
const connection = require('../config/dbconnection');
const getList = asyncHandler(async (req, res) => {
    const query = 'SELECT * FROM tbllogins';
    connection.query(query, (err, results, fields) => {
        if (err) {
            console.error('Error executing the query:', err);
            connection.end();
            return;
        }
        if (results.length === 0) {
            // No records found, send a custom message
            res.status(200).json({ message: 'No records found' ,status: 'null'});
          } else {
            // Records found, send them in the response
            res.status(200).json({ message: 'Data fetched sucessfully' ,status: 'success', results});
          }
    });
});
module.exports = { getList };
