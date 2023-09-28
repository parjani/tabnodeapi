const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '3.111.29.79',
    user: 'srifh',
    password: 'SRias##2050',
    database: 'sample'
});
connection.connect((error) => {
    if (error) {
        console.error('Failed to connect to the database:', error);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = connection;