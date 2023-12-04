import server from "./server";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = secp256k1.getPublicKey(privateKey);
    const address = bytesToHex(keccak256(publicKey.slice(1)).slice(-20));
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type the Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Address
        <input type="text" placeholder="The Address is: " value={address} disabled />
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
