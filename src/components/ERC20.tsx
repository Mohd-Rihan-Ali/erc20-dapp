import React, { useContext, useState } from "react";
import { useERC20 } from "../utils/contexts/ERC20Context";

const ERC20: React.FC = () => {
  const { connectWallet, transfer, approve, transferFrom, account } =
    useERC20();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [spender, setSpender] = useState("");
  const [from, setFrom] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <h1>ERC20 Token Interaction</h1>
        {!account && <button onClick={connectWallet}>Connect Wallet</button>}
        {account && <div>Connected account: {account}</div>}

        <div>
          <h2>Approve</h2>
          <input
            type="text"
            placeholder="Spender"
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => approve(spender, amount)}>Approve</button>
        </div>
        <div>
          <h2>Transfer</h2>
          <input
            type="text"
            placeholder="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => transfer(recipient, amount)}>Transfer</button>
        </div>

        <div>
          <h2>TransferFrom</h2>
          <input
            type="text"
            placeholder="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="text"
            placeholder="to"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={() => transferFrom(from, recipient, amount)}>
            TransferFrom
          </button>
        </div>
      </header>
    </div>
  );
};

export default ERC20;
