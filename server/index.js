const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("@noble/curves/secp256k1");
const { bytesToHex, utf8ToBytes } = require("@noble/curves/abstract/utils");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

app.use(cors());
app.use(express.json());

const balances = {
  "b6e11566068ed5cb75e4eec7c5e14c50e879a974": 100,
  "1fa6d8a18784c1d91416ff103225abf4b15143a5": 50,
  "200ef9ec41b43b8f3f16fb29a8e363e17a2409ef": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signedMessage } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const message = bytesToHex(keccak256(utf8ToBytes(amount.toString())));
  const sig = JSON.parse(signedMessage);
  sig.r = BigInt(sig.r);
  sig.s = BigInt(sig.s);

  const signature = new secp256k1.Signature(sig.r, sig.s, sig.recovery);
  const publicKey = signature.recoverPublicKey(message).toHex();
  const isValid = secp256k1.verify(signature, message, publicKey);

  if (!isValid) {  
    res.status(400).send({ message: "Not invalid sender!" });
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
