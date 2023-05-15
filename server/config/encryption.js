const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const publicKeyPath = path.join(__dirname, "..", "privatersa");
const privateKeyPath = path.join(__dirname, "..", "privatersa.pub");
const privateKeyPassphrase = "12345678"; // Replace with your passphrase

const privateKey = fs.readFileSync(privateKeyPath, {
  encoding: "utf8",
  passphrase: privateKeyPassphrase,
});

const publicKey = fs.readFileSync(publicKeyPath);

function encryptData(publicKey, data) {
  const buffer = Buffer.from(data, "utf8");
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );
  return encrypted.toString("base64");
}

async function decryptData(privateKey, data) {
  const buffer = Buffer.from(data, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: privateKeyPassphrase,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );
  return decrypted.toString("utf8");
}

exports.encryptData = encryptData;
exports.decryptData = decryptData;
exports.publicKey = publicKey;
exports.privateKey = privateKey;
