"use client";
import { useUser } from "@/context/UserContext";
import React, { useEffect, useState } from "react";
import { Loader2, ChevronRight, X } from "lucide-react";
import { fetchBets } from "@/lib/database/edit-data";

// Define TypeScript interfaces
interface BetItem {
  betId: string;
  home_team: string;
  away_team: string;
  odds: string;
}

interface Bet {
  id: string;
  userId: string;
  betAmount: number;
  potentialWinnings: number;
  totalOdds: number;
  BETSLIP: BetItem[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  status: string;
}

const HistoryComponent = () => {
  const { userData } = useUser();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);

  useEffect(() => {
    const getBets = async () => {
      if (!userData.user_id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchBets(userData.user_id);
        if (response.error) {
          setError(response.message);
        } else {
          setBets(response.bets);
        }
      } catch (err) {
        console.error("Error fetching bets:", err);
        setError("Failed to load bet history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getBets();
  }, [userData.user_id]);

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openBetDetails = (bet: Bet) => {
    setSelectedBet(bet);
  };

  const closeBetDetails = () => {
    setSelectedBet(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "won":
        return "text-green-500";
      case "lost":
        return "text-red-500";
      case "pending":
        return "text-yellow-300";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-[80dvh] bg-[#2c2e37] text-white p-4">
      <h1 className="text-xl font-bold mb-6 text-center">Bet History</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-300" />
          <p className="mt-4 text-gray-300">Loading your bet history...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-md text-center">
          <p>{error}</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-[#3a3c45] rounded-md p-6">
          <p className="text-lg mb-2">No bets made yet</p>
          <p className="text-gray-300 text-center">
            When you place bets, they will appear here so you can track your
            winnings.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-[#3a3c45] p-4 rounded-md cursor-pointer hover:bg-[#4a4c55] transition-colors"
              onClick={() => openBetDetails(bet)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-300 font-medium">
                    Bet ID: {bet.id}
                  </p>
                  <p className="text-sm text-gray-300">
                    {formatDate(bet.createdAt)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="mt-3 pt-3 border-t border-gray-600 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="font-medium">
                    {bet.betAmount} <sub className="italic">Sol</sub>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Potential Win</p>
                  <p className="font-medium text-green-400">
                    {bet.potentialWinnings.toFixed(2)}{" "}
                    <sub className="italic">Sol</sub>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`font-medium ${getStatusColor(bet.status)}`}>
                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bet Details Modal */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2c2e37] rounded-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">Bet Details</h2>
              <button
                onClick={closeBetDetails}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-xs text-gray-400">Bet ID</p>
                <p className="text-sm">{selectedBet.id}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400">Date</p>
                <p className="text-sm">{formatDate(selectedBet.createdAt)}</p>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="font-medium">
                    {selectedBet.betAmount} <sub className="italic">Sol</sub>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Odds</p>
                  <p className="font-medium">{selectedBet.totalOdds}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p
                    className={`font-medium ${getStatusColor(
                      selectedBet.status
                    )}`}
                  >
                    {selectedBet.status.charAt(0).toUpperCase() +
                      selectedBet.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-medium mb-2">Potential Winnings</p>
                <p className="text-lg font-bold text-green-400">
                  {selectedBet.potentialWinnings.toFixed(2)}{" "}
                  <sub className="italic">Sol</sub>
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm font-medium mb-2">Selected Games</p>
                <div className="space-y-2">
                  {selectedBet.BETSLIP.map((game, index) => (
                    <div
                      key={game.betId}
                      className="bg-[#3a3c45] p-3 rounded-md"
                    >
                      <p className="text-yellow-300">{game.home_team}</p>
                      <p className="text-gray-300">vs {game.away_team}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-400">Odds</p>
                        <p className="bg-green-800 px-2 py-1 rounded-sm text-white text-xs">
                          {game.odds}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryComponent;
