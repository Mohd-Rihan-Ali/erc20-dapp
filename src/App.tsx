import { useState, useEffect } from "react";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { ABI } from "./ABI";

dotenv.config();

const App = () => {
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const contractAddress = process.env.CONTRACT_ADDRESS as string;
  const contractABI = ABI;

  useEffect(() => {
    const loadProvider = async () => {
      if ((window as any).ethereum) {
        const tempProvider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        setProvider(tempProvider);

        const tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        const tempAddress = await tempSigner.getAddress();
        setAddress(tempAddress);

        const tempContract = new ethers.Contract(
          contractAddress,
          contractABI,
          tempSigner
        );
        setContract(tempContract);

        const tempBalance = await tempContract.balanceOf(tempAddress);
        setBalance(tempBalance.toString());
      } else {
        alert("Please install MetaMask");
        console.log("Please install MetaMask");
      }
    };
    loadProvider();
  }, []);


  const fetchEvents = useQuery({
    queryKey: [],
    queryFn: async () => {
      return await fetch("http://localhost:8800/events").then((res) =>
        res.json()
      );
    },
  });
  console.log(fetchEvents.data);

  return (
    <div className="App">
      <h1>ERC20 DApp</h1>
      <p>Address: {address}</p>
      <p>Balance: {balance}</p>

      <h2>Token Transfer Events</h2>
      {isLoading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p>Error loading events: </p>
      ) : (
        <ul>
          {events.map((event: any, index: number) => {
            <li key={index}>
      <p>From: {fetchEvents.data.from}</p>
      <p>To: {fetchEvents.data.to}</p>
      <p>Value: {fetchEvents.data.value}</p>
      <p>Bloack Number: {fetchEvents.data.blockNumber} </p>
      <p>Transaction Hash: {fetchEvents.data.transactionHash} </p> */}
      </li>;
       })} 
      </ul> 
      )}
    </div>
  );
};

export default App;
