const { createHash } = require("crypto");

function generateRandomString() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

function truncateTo10Chars(str) {
    return str.slice(0, 10);
}

function generateAffiliationID(name) {
  const hashedName = createHash("md5").update(name).digest("hex");
  const timestamp = Date.now().toString().slice(-6);
  const affiliationID = "A" + hashedName + timestamp;
  return truncateTo10Chars(affiliationID);
}

function generateVehicleID(name) {
  const hashedName = createHash("md5").update(name).digest("hex");
  const timestamp = Date.now().toString().slice(-6);
  const vehicleID = "V" + hashedName + timestamp;
  return truncateTo10Chars(vehicleID);
}

function generateBankID(name) {
  const hashedName = createHash("md5").update(name).digest("hex");
  const timestamp = Date.now().toString().slice(-6);
  const bankID = "B" + hashedName + timestamp;
  return truncateTo10Chars(bankID);
}

module.exports = {
    generateRandomString,
  generateAffiliationID,
  generateVehicleID,
  generateBankID,
};
