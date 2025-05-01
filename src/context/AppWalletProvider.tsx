"use client";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TrustWalletAdapter,
  CoinbaseWalletAdapter,
  BitgetWalletAdapter,
  MathWalletAdapter,
  Coin98WalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //  const network = "mainnet-beta"; // Use Mainnet for production
  const endpoint = useMemo(() => {
    // Use a custom RPC endpoint for Mainnet
    return "https://dry-practical-night.solana-mainnet.quiknode.pro/7a983e80c88f134471582a3d568c186ec7a27711/"; // Replace with your custom RPC URL
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new TrustWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new BitgetWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
