import "./globals.css";
import Header from "@/components/Header";
import { UserProvider } from "@/context/UserContext";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import AppWalletProvider from "@/context/AppWalletProvider";
import FloatingCredit from "@/components/FloatingComponent";

export const metadata: Metadata = {
  title: {
    template: "%s | Bet9ja",
    default: "Bet9ja Sports Betting",
  },
  description: "Betting Website designed by 9jacoder",
  applicationName: "Betting Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="max-w-7xl mx-auto">
            <Header />
            <AppWalletProvider>
              {children}

              <FloatingCredit />
            </AppWalletProvider>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
