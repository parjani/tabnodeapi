const config = require("../config/apikey");
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['apikey'];
  
    if (apiKey === config.apiKey) {
      next(); // API key is valid, continue to the next middleware/controller method
    } else {
      res.status(401).json({ error: 'Unauthorized API Key' });
    }
  }
  
module.exports = authenticateApiKey;