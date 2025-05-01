import React from "react";
import { Bet, Outcome } from "@/lib/types/bet";
import { useUser } from "@/context/UserContext";

interface IndividualBetProps {
  bet: Bet;
}

const IndividualBet: React.FC<IndividualBetProps> = ({ bet }) => {
  const { home_team, away_team, commence_time, bookmakers, id } = bet;
  const { betSlip, setBetSlip } = useUser();

  // Safely get the first bookmaker's h2h market odds
  const h2hMarket = bookmakers[0]?.markets.find((m) => m.key === "h2h");
  const odds: Outcome[] = h2hMarket?.outcomes ?? [];

  // Format the commence time
  const commenceDate = new Date(commence_time).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const addBet = (odd: string, outcome: Outcome) => {
    const betItem = {
      betId: id,
      home_team,
      away_team,
      odds: odd,
    };

    setBetSlip((prev) => {
      const isBetInSlip = prev.betslip.some((item) => item.betId === id);

      if (isBetInSlip) {
        // Remove the bet if it exists
        return {
          betslip: prev.betslip.filter((item) => item.betId !== id),
        };
      } else {
        // Add the bet to the top of the list
        return {
          betslip: [betItem, ...prev.betslip],
        };
      }
    });
  };

  const isOddInBetSlip = (odd: string) => {
    return betSlip.betslip.some(
      (item) => item.betId === id && item.odds === odd
    );
  };

  return (
    <div className="bg-[#2b2d36] shadow-md flex items-center justify-between transition-colors duration-200 p-1">
      {/* Time */}
      <div className="w-1/6 text-[11px] text-yellow-300 font-light px-2">
        <time>{commenceDate}</time>
      </div>

      {/* Matchup */}
      <div className="w-3/6 text-white">
        <div className="flex flex-col space-y-1">
          <span className="text-[12px] truncate">{home_team}</span>
          <span className="text-[12px] truncate">{away_team}</span>
        </div>
      </div>

      {/* Odds */}
      <div className="w-2/6 flex justify-end space-x-1">
        {odds.map((outcome, index) => {
          const oddValue = outcome.price.toFixed(2);
          const isSelected = isOddInBetSlip(oddValue);

          return (
            <button
              key={index}
              className={`text-white font-bold w-12 h-8 flex items-center justify-center rounded-[2px] hover:bg-green-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-700 text-[12px] ${
                isSelected ? "bg-green-400" : "bg-green-800"
              }`}
              onClick={() => addBet(oddValue, outcome)}
            >
              {oddValue}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IndividualBet;
