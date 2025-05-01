import { useUser } from "@/context/UserContext";
import { Trash2, Volleyball } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { addBet } from "@/lib/database/edit-data";
import BetStatus from "../elements/BetStatus";

// Define TypeScript interfaces
interface BetItem {
  betId: string;
  home_team: string;
  away_team: string;
  odds: string;
}

interface BetObject {
  userId: string;
  betAmount: number;
  potentialWinnings: number;
  totalOdds: number;
  BETSLIP: BetItem[];
}

interface BetResponse {
  error: boolean;
  message: string;
  newBalance: number;
  betId: string;
}

const BetSlip = () => {
  const { betSlip, setBetSlip, userData, setUserData } = useUser();
  const BETSLIP = betSlip.betslip;
  const [betAmount, setBetAmount] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [winnings, setWinnings] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate total odds by multiplying all individual odds
  const totalOdds = BETSLIP.reduce(
    (acc, bet) => acc * parseFloat(bet.odds),
    1
  ).toFixed(2);

  // Calculate potential winnings with comma formatting
  const potentialWinnings = betAmount
    ? (parseFloat(betAmount) * parseFloat(totalOdds))
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "0.00";

  const removeBet = (betId: string) => {
    // Reset success message when user starts interacting with betslip again
    setSuccess("");
    setWinnings("");

    setBetSlip((prev) => ({
      betslip: prev.betslip.filter((item) => item.betId !== betId),
    }));
  };

  const clearBetSlip = () => {
    // Reset success message when user clears betslip
    setSuccess("");
    setWinnings("");
    setBetSlip({ betslip: [] });
  };

  const bookBet = async () => {
    setError("");

    if (!betAmount) {
      setError("Please input a bet amount");
      return;
    }

    setIsLoading(true);

    if (parseFloat(betAmount) > userData.funds) {
      setError(
        "You don't have enough Solana to complete this bet, please top up and try again"
      );
      setIsLoading(false);
      return;
    }

    const betObject: BetObject = {
      userId: userData.user_id,
      betAmount: Number(betAmount),
      potentialWinnings: Number(potentialWinnings.replace(/,/g, "")),
      totalOdds: Number(totalOdds),
      BETSLIP,
    };

    try {
      const { error, message, newBalance, betId }: BetResponse = await addBet(
        betObject
      );

      if (error) {
        setError(message);
        setIsLoading(false);
        return;
      }

      // Store calculated winnings for success message
      setWinnings(potentialWinnings);
      setSuccess(betId);

      // Update user balance
      setUserData((prev) => ({
        ...prev,
        funds: newBalance,
      }));

      // Clear betslip and bet amount after successful bet
      setBetSlip({ betslip: [] });
      setBetAmount("");
    } catch (err) {
      setError("An error occurred while placing your bet. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset success message when user adds a new bet
  const resetSuccessMessage = () => {
    if (success) {
      setSuccess("");
      setWinnings("");
    }
  };

  // If a new bet is added to an empty betslip after a successful bet, clear the success message
  if (BETSLIP.length > 0 && success) {
    resetSuccessMessage();
  }

  return (
    <div className="text-xs text-white">
      <h1 className="bg-[#4e5261] p-2 flex items-center justify-between">
        <div className="flex items-center">
          BetSlip <Volleyball className="h-3 animate-bounce ml-2" />
        </div>
        {BETSLIP.length > 2 && (
          <button
            onClick={clearBetSlip}
            className="text-xs py-1 h-6 bg-transparent hover:no-underline underline"
          >
            clear betslip
          </button>
        )}
      </h1>
      <div className="bg-[#2c2e37] p-1">
        {success ? (
          <div className="bg-green-800 p-4 rounded text-center space-y-2">
            <p className="text-lg font-bold text-white">Congratulations!</p>
            <p>Your bet is successful</p>
            <p className="text-yellow-300">
              Your potential winnings: {winnings}{" "}
              <sub className="italic">Sol</sub>
            </p>
            <p className="text-xs">Bet ID: {success}</p>
            <button
              onClick={resetSuccessMessage}
              className="mt-3 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Place Another Bet
            </button>
          </div>
        ) : BETSLIP.length === 0 ? (
          <>
            <p className="text-center">Your bet slip is empty</p>
            <p className="text-gray-300 text-center">
              Please make one or more selections in order to place a bet.
            </p>
          </>
        ) : (
          <div className="space-y-1">
            {BETSLIP.map((bet) => (
              <div
                key={bet.betId}
                className="flex items-center justify-between bg-[#3a3c45] p-2 rounded-[2px]"
              >
                <div className="flex-1 text-yellow-300">
                  <p className="truncate">{bet.home_team}</p>
                  <p className="truncate">vs {bet.away_team}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-800 px-2 py-1 rounded-sm text-white">
                    {bet.odds}
                  </span>
                  <button
                    onClick={() => removeBet(bet.betId)}
                    className="text-red-400 hover:text-red-300 focus:outline-none"
                    aria-label="Remove bet"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 space-y-2">
              <div className="bg-[#3a3c45] p-2 rounded-[2px]">
                <div className="flex justify-between">
                  <p className="text-yellow-300 my-auto">Total Odds</p>
                  <p className="text-lg font-bold">{totalOdds}</p>
                </div>
              </div>

              <div className="bg-[#3a3c45] p-2 rounded-[2px]">
                <div className="flex justify-between items-center">
                  <p className="text-yellow-300">Stake Amount</p>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => {
                      setBetAmount(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter amount"
                    className={`p-1 rounded-sm text-black w-1/3 text-right ${
                      error ? "bg-red-100 border-red-500" : "bg-white"
                    }`}
                    min="0"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <p className="my-auto">Potential Winnings</p>
                  <p className="font-bold text-green-400 text-lg">
                    {potentialWinnings}
                    <sub className="text-green-600 italic">Sol</sub>
                  </p>
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>

              {betAmount && (
                <button
                  disabled={!userData.user_id || isLoading}
                  className={`
                    text-center 
                    w-full 
                    py-2 
                    text-md 
                    rounded-[2px] 
                    transition
                    relative
                    ${
                      !userData.user_id || isLoading
                        ? "opacity-70 cursor-not-allowed bg-green-600"
                        : "hover:cursor-pointer bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 duration-700 ease-out"
                    }
                    ${isLoading ? "animate-pulse" : ""}
                  `}
                  onClick={bookBet}
                >
                  {isLoading ? "Loading..." : "Book Bet"}
                </button>
              )}
            </div>
          </div>
        )}

        {!success && <BetStatus />}
      </div>

      <img
        src="https://cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/Artboard_1.jpg"
        className="w-full mt-2"
        alt="Promotion banner 1"
      />

      <img
        src="https://cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/supersidecorrect.jpg"
        className="w-full mt-2"
        alt="Promotion banner 2"
      />
    </div>
  );
};

export default BetSlip;
