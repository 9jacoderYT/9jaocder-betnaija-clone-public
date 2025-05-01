"use client";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import SolanaWallet from "./solanaWallet";

const FundsComponent = () => {
  const { userData } = useUser();
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [isError, setIsError] = useState(false);

  const handleWithdrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWithdrawAmount(value);

    // Check if the entered amount exceeds available funds
    const amount = parseFloat(value) || 0;
    const availableFunds = userData.funds || 0;
    if (amount > availableFunds) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  const handleMaxClick = () => {
    const availableFunds = userData.funds || 0;
    setWithdrawAmount(availableFunds.toString());
    setIsError(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 p-5 bg-[#272729]">
      {/* Add Funds Box */}
      <div className="w-full max-w-md p-5 rounded-lg bg-[#373a45] shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Funds</h2>
        <input
          type="number"
          placeholder="Type amount"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          onChange={(e) => setPaymentAmount(e.target.value)}
        />

        <SolanaWallet amount={paymentAmount} />
      </div>

      {/* Withdraw Box */}
      <div className="w-full max-w-md p-5 rounded-lg bg-[#373a45] shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Withdraw</h2>
        <div className="relative mb-4">
          <input
            type="number"
            value={withdrawAmount}
            onChange={handleWithdrawChange}
            placeholder="Enter amount to withdraw"
            className={`w-full p-2 pr-20 border rounded-md focus:outline-none focus:ring-2 ${
              isError
                ? "border-red-500 focus:ring-red-500 glow-red"
                : "border-gray-300 focus:ring-blue-500"
            } bg-white`}
          />
          <button
            onClick={handleMaxClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Max
          </button>
        </div>
        <div className="text-sm text-gray-300 mb-4">
          Available: {(userData.funds || 0).toFixed(2)}
        </div>
        <button className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
          Withdraw
        </button>
      </div>

      {/* Add custom CSS for the red glow effect */}
      <style jsx>{`
        .glow-red {
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
        }
      `}</style>
    </div>
  );
};

export default FundsComponent;
