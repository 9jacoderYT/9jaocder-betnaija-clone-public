import React, { useState } from "react";
import { Button } from "../ui/button";
import { fetchBetById } from "@/lib/database/edit-data";
import { useUser } from "@/context/UserContext";
import { Loader2, X, CheckCircle, AlertCircle, Clock } from "lucide-react";

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

const BetStatus = () => {
  const { setBetSlip } = useUser();
  const [bookingInput, setBookingInput] = useState("");
  const [checkBetInput, setCheckBetInput] = useState("");
  const [loading, setLoading] = useState<{
    booking: boolean;
    checking: boolean;
  }>({
    booking: false,
    checking: false,
  });
  const [error, setError] = useState<{
    booking: string | null;
    checking: string | null;
  }>({
    booking: null,
    checking: null,
  });
  const [success, setSuccess] = useState<{
    booking: boolean;
    checking: boolean;
  }>({
    booking: false,
    checking: false,
  });
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);

  const handleBookBet = async () => {
    if (!bookingInput.trim()) {
      setError((prev) => ({ ...prev, booking: "Please enter a bet ID" }));
      return;
    }

    setLoading((prev) => ({ ...prev, booking: true }));
    setError((prev) => ({ ...prev, booking: null }));
    setSuccess((prev) => ({ ...prev, booking: false }));

    try {
      const response = await fetchBetById(bookingInput.trim());

      if (response.error || !response.bet) {
        setError((prev) => ({
          ...prev,
          booking: response.message || "Bet not found",
        }));
        return;
      }

      // Extract the BETSLIP items and add them to the user's betslip
      const betItems = response.bet.BETSLIP;
      setBetSlip((prev) => ({
        betslip: [...prev.betslip, ...betItems],
      }));

      setSuccess((prev) => ({ ...prev, booking: true }));
      setBookingInput("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess((prev) => ({ ...prev, booking: false }));
      }, 3000);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        booking: "An error occurred. Please try again.",
      }));
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, booking: false }));
    }
  };

  const handleCheckBet = async () => {
    if (!checkBetInput.trim()) {
      setError((prev) => ({ ...prev, checking: "Please enter a bet ID" }));
      return;
    }

    setLoading((prev) => ({ ...prev, checking: true }));
    setError((prev) => ({ ...prev, checking: null }));

    try {
      const response = await fetchBetById(checkBetInput.trim());

      if (response.error || !response.bet) {
        setError((prev) => ({
          ...prev,
          checking: response.message || "Bet not found",
        }));
        return;
      }

      setSelectedBet(response.bet as Bet);
      setCheckBetInput("");
    } catch (err) {
      setError((prev) => ({
        ...prev,
        checking: "An error occurred. Please try again.",
      }));
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, checking: false }));
    }
  };

  const closeModal = () => {
    setSelectedBet(null);
  };

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "won":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "lost":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-300" />;
      default:
        return null;
    }
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
    <>
      <div className="space-y-2 mt-4">
        <b>Book: </b>
        <br />
        Please insert a booking number below.
        <br />
        <div className="space-x-2">
          <input
            type="text"
            className={`bg-white p-1 rounded-sm text-black ${
              error.booking ? "border border-red-500" : ""
            }`}
            value={bookingInput}
            onChange={(e) => {
              setBookingInput(e.target.value);
              setError((prev) => ({ ...prev, booking: null }));
            }}
            placeholder="Enter bet ID"
          />
          <Button
            size="sm"
            variant="custom"
            onClick={handleBookBet}
            disabled={loading.booking}
          >
            {loading.booking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Book"
            )}
          </Button>
        </div>
        {error.booking && (
          <p className="text-red-400 text-xs mt-1">{error.booking}</p>
        )}
        {success.booking && (
          <p className="text-green-400 text-xs mt-1">
            Added to betslip successfully!
          </p>
        )}
      </div>

      <div className="space-y-2 mt-4">
        <b>Check bet: </b>
        <br />
        Insert a valid Bet ID to check status.
        <br />
        <div className="space-x-2">
          <input
            type="text"
            className={`bg-white p-1 rounded-sm text-black ${
              error.checking ? "border border-red-500" : ""
            }`}
            value={checkBetInput}
            onChange={(e) => {
              setCheckBetInput(e.target.value);
              setError((prev) => ({ ...prev, checking: null }));
            }}
            placeholder="Enter bet ID"
          />
          <Button
            size="sm"
            variant="custom"
            onClick={handleCheckBet}
            disabled={loading.checking}
          >
            {loading.checking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Check"
            )}
          </Button>
        </div>
        {error.checking && (
          <p className="text-red-400 text-xs mt-1">{error.checking}</p>
        )}
      </div>

      {/* Bet Details Modal */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2c2e37] rounded-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">Bet Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-400">Bet ID</p>
                <p className="text-sm">{selectedBet.id}</p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-400">Date Placed</p>
                <p className="text-sm">{formatDate(selectedBet.createdAt)}</p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-400">Status</p>
                <div className="flex items-center">
                  {getStatusIcon(selectedBet.status)}
                  <span
                    className={`ml-1 font-medium ${getStatusColor(
                      selectedBet.status
                    )}`}
                  >
                    {selectedBet.status.charAt(0).toUpperCase() +
                      selectedBet.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-[#3a3c45] rounded-md">
                <div>
                  <p className="text-xs text-gray-400">Bet Amount</p>
                  <p className="font-medium">
                    {selectedBet.betAmount} <sub className="italic">Sol</sub>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Odds</p>
                  <p className="font-medium">{selectedBet.totalOdds}</p>
                </div>
              </div>

              <div className="mb-6 p-3 bg-[#3a3c45] rounded-md">
                <p className="text-xs text-gray-400">Potential Winnings</p>
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
    </>
  );
};

export default BetStatus;
