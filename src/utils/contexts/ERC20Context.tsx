import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { ethers } from "ethers";
import { ABI } from "../../ABI";
import dotenv from "dotenv";

dotenv.config();

// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const CONTRACT_ADDRESS = "0x6266018b6b119c8c4b4c564602ee0c59ecdf841c";
console.log("Contract address:", CONTRACT_ADDRESS);

const contractABI = ABI;

interface ERC20ContextProps {
  connectWallet: () => void;
  transfer: (recipient: string, amount: string) => Promise<void>;
  approve: (spender: string, amount: string) => Promise<void>;
  transferFrom: (
    sender: string,
    recipient: string,
    amount: string
  ) => Promise<void>;
  account: string | null;
}

export const ERC20Context = createContext<ERC20ContextProps>({
  connectWallet: async () => {},
  transfer: async () => {},
  approve: async () => {},
  transferFrom: async () => {},
  account: null,
});

export const ERC20Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // useEffect(() => {
  //   if ((window as any).ethereum && provider) {
  //     (window as any).ethereum
  //       .on("accountsChanged", (accounts: string[]) => {
  //         setAccount(accounts[0]);
  //       })(window as any)
  //       .ethereum.on("chainChanged", () => {
  //         (window as any).location.reload();
  //       });
  //   }
  // }, [provider]);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );
        const accounts = await provider.listAccounts();
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(accounts[0]);

        console.log("Connected account:", accounts[0]);
        console.log("Contract address:", CONTRACT_ADDRESS);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask");
      console.log("Please install MetaMask");
    }
  };

  const approve = async (spender: string, amount: string) => {
    if (contract && signer) {
      try {
        const tx = await contract.approve(
          spender,
          ethers.utils.parseUnits(amount, 18)
        );
        await tx.wait();

        console.log("Approved");
        alert("Approved");
      } catch (error) {
        console.error("Error approving:", error);
        alert("Error approving");
      }
    }
  };

  const transfer = async (recipient: string, amount: string) => {
    if (contract && signer) {
      try {
        const tx = await contract.transfer(
          recipient,
          ethers.utils.parseUnits(amount, 18)
        );
        await tx.wait();
      } catch (error) {
        console.error("Error transferring:", error);
        alert("Error transferring");
      }
    } else {
      alert("Contract or signer not found");
    }
  };

  const transferFrom = async (from: string, to: string, amount: string) => {
    if (contract && signer) {
      try {
        const tx = await contract.transferFrom(
          from,
          to,
          ethers.utils.parseUnits(amount, 18)
        );
        await tx.wait();

        alert("TransferFrom successful!");
      } catch (error) {
        console.error("Error transferring from:", error);
        alert("Error transferring from");
      }
    } else {
      alert("Contract or signer not found");
    }
  };

  return (
    <ERC20Context.Provider
      value={{ connectWallet, transfer, approve, transferFrom, account }}
    >
      {children}
    </ERC20Context.Provider>
  );
};

export const useERC20 = () => useContext(ERC20Context);
