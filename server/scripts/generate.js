const { secp256k1 } = require("@noble/curves/secp256k1");
const { bytesToHex } = require("@noble/curves/abstract/utils");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
const address = keccak256(publicKey.slice(1)).slice(-20);

console.log('\nprivate key:', bytesToHex(privateKey));
console.log('\npublicKey:', bytesToHex(publicKey));
console.log('\naddress:', bytesToHex(address));