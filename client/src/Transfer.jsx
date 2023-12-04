import { useState } from "react";
import server from "./server";

import { secp256k1 } from "@noble/curves/secp256k1";
import { utf8ToBytes, bytesToHex } from '@noble/curves/abstract/utils';
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = bytesToHex(keccak256(utf8ToBytes(sendAmount)));
    let signedMessage = secp256k1.sign(message, privateKey);

    signedMessage = JSON.stringify({
      ...signedMessage,
      r: (signedMessage.r).toString(),
      s: (signedMessage.s).toString(),
      recovery: signedMessage.recovery,
    });

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signedMessage
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
