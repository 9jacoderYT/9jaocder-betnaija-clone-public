"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserData {
  user_id: string | number | null;
  user_name: string | null;
  loading: boolean;
  funds: number;
}

export interface SportsData {
  sports_id: string;
}

export interface BetSlipItem {
  betId: string;
  home_team: string;
  away_team: string;
  odds: string;
}

export interface BetSlipData {
  betslip: BetSlipItem[];
}

interface UserContextType {
  userData: UserData;
  sportsId: SportsData;
  betSlip: BetSlipData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setSportsId: React.Dispatch<React.SetStateAction<SportsData>>;
  setBetSlip: React.Dispatch<React.SetStateAction<BetSlipData>>;
}

const defaultUserData: UserData = {
  user_id: null,
  user_name: null,
  loading: false,
  funds: 0,
};

const defaultSportsData: SportsData = {
  sports_id: "soccer_epl",
};

const defaultBetSlip: BetSlipData = {
  betslip: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [sportsId, setSportsId] = useState<SportsData>(defaultSportsData);
  const [betSlip, setBetSlip] = useState<BetSlipData>(defaultBetSlip);

  return (
    <UserContext.Provider
      value={{
        userData,
        sportsId,
        betSlip,
        setUserData,
        setSportsId,
        setBetSlip,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
