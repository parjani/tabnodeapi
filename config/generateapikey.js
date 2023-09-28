const crypto = require('crypto');
function generateApikey(){
    const apikeylength = 20;
    const randomBytes = crypto.randomBytes(apikeylength);
    return randomBytes.toString('hex');
}
const apikey = generateApikey();
console.log('Genearted apikey',apikey)