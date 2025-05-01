"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  SystemProgram,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { addFunds } from "@/lib/database/edit-data";
import { useUser } from "@/context/UserContext";

// Destination address for SOL transfer
const DESTINATION_ADDRESS = new PublicKey(
  "5Kgg1pE57bqRN1bSzXCBeoXTEuH1HTzcm1wmQ9dtHbcj"
);

const SolanaWallet = ({ amount }: { amount: number }) => {
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData, setUserData } = useUser();

  // Fetch SOL balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }
      try {
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      } catch (err) {
        console.error("Error fetching SOL balance:", err);
        setBalance(0);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  const depositSOL = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Invalid withdrawal amount");
      return;
    }

    if (!connected || !publicKey || !signTransaction) {
      alert("Please connect your wallet");
      return;
    }

    if (balance === null || balance < amount) {
      setShowInsufficientFunds(true);
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const transaction = new Transaction();
      const latestBlockhash = await connection.getLatestBlockhash();

      // Add compute budget instructions (optional but recommended)
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 500000 }),
        ComputeBudgetProgram.setComputeUnitLimit({ units: 200000 })
      );

      // Transfer SOL to the destination address
      const amountInLamports = amount * LAMPORTS_PER_SOL;
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: DESTINATION_ADDRESS,
          lamports: amountInLamports,
        })
      );

      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      const confirmation = await connection.confirmTransaction(
        { signature: txId, ...latestBlockhash },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction confirmation failed");
      }

      console.log(userData);
      
      const { errorbol, newfunds } = await addFunds(userData.user_id, amount);

      if (error) throw new Error("Unable to fund account");

      setUserData((prev) => ({
        ...prev,
        funds: newfunds,
      }));
      setShowSuccess(true);
    } catch (err) {
      console.error("Transaction error:", err);
      setError("Error processing withdrawal");
      setShowFailure(true);
    } finally {
      setIsPending(false);
    }
  };

  const buttonClasses = `flex justify-center items-center cursor-pointer px-2 max-md:px-2 rounded-[4px] border-[1px] border-white capitalize font-bold transition-all duration-200 max-lg:h-[56px] max-lg:text-xl disabled:bg-gray-400 disabled:cursor-not-allowed ${
    connected
      ? "bg-pink-300 hover:bg-pink-400"
      : "bg-cyan-500 hover:bg-cyan-500/80"
  } text-white text-lg`;

  return (
    <div className="relative flex flex-col items-center gap-4 w-full">
      <WalletMultiButton
        style={{
          background: "#06B6f4",
          border: "1px solid white",
          borderRadius: "4px",
          fontSize: "18px",
          color: "white",
        }}
      />

      {connected && (
        <Button
          className={buttonClasses}
          onClick={depositSOL}
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            `Make ${amount} Payment`
          )}
        </Button>
      )}

      {/* AlertDialog components */}
      <AlertDialog
        open={showInsufficientFunds}
        onOpenChange={setShowInsufficientFunds}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader className="p-3">
            <AlertDialogTitle>Insufficient Funds</AlertDialogTitle>
            <AlertDialogDescription>
              You don’t have enough SOL to complete this withdrawal. Your
              balance is {balance} SOL, but you requested {amount} SOL. Please
              top up your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader className="p-3">
            <AlertDialogTitle>Deposit Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Your withdrawal of {amount} SOL was successful!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showFailure} onOpenChange={setShowFailure}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader className="p-3">
            <AlertDialogTitle>Withdrawal Failed</AlertDialogTitle>
            <AlertDialogDescription>
              The withdrawal failed: {error || "Unknown error"}. Please try
              again or contact admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SolanaWallet;
