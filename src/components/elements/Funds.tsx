import { useUser } from "@/context/UserContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Funds = () => {
  const { userData, setUserData } = useUser();
  const [fundsLoading, setFundsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!userData.user_id) return;

    const fetchUserFunds = async () => {
      try {
        setFundsLoading(true);

        const response = await fetch("/api/funds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.user_id }),
        });

        const data = await response.json();

        console.log(data);

        if (data.user) {
          setUserData((prev) => ({
            ...prev,
            funds: data.user.funds,
          }));
        }
        setFundsLoading(false);
      } catch (error) {
        console.error("Error fetching user funds:", error);
        setFundsLoading(false);
      }
    };

    fetchUserFunds();
  }, [userData.user_id, setUserData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".funds-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="funds-container relative">
      {fundsLoading ? (
        <div className="spinner-container">
          <div className="spinner border-2 border-t-2 border-gray-200 border-t-blue-600 rounded-full w-4 h-4 animate-spin"></div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 focus:outline-none"
          >
            <p>{(userData.funds || 0).toFixed(2)} SOL</p>
            <svg
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10 text-black">
              <Link
                href="/funds"
                onClick={() => setIsDropdownOpen(false)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Add funds
              </Link>
              <Link
                href="/funds"
                onClick={() => setIsDropdownOpen(false)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Withdraw
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Funds;
