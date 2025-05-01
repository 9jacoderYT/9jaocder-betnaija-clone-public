"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Menu, X, Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useUser } from "@/context/UserContext";
import Funds from "./elements/Funds";
import Link from "next/link";

const navItems = [
  { label: "Sports", href: "/", active: true },
  { label: "Live", href: "/liveCompetitions" },
  { label: "Casino", href: "https://casino.bet9ja.com/casino/?s=new" },
  {
    label: "Live Casino",
    href: "https://casino.bet9ja.com/casino/category/live_casino/?s=new",
  },
  {
    label: "League&Races",
    href: "https://virtual.bet9ja.com/leagueandraces/",
  },
  { label: "Virtual", href: "https://virtual.bet9ja.com/virtual/?s=new" },
  { label: "Lotto", href: "https://lotto.bet9ja.com/lotto/" },
  {
    label: "Super9ja",
    href: "https://www.bet9ja.com/super9ja/?s=new",
    tooltip: "free",
  },
  { label: "Firebets", href: "https://firebets.bet9ja.com/?s=new" },
  { label: "Promotions", href: "https://promotions.bet9ja.com/promotions/" },
];

const Header = () => {
  // Global States
  const { userData, setUserData } = useUser();
  // Component states
  const [loginCode, setLoginCode] = useState("");
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Updated loginUser function with loading state
  const loginUser = async () => {
    if (!loginCode) {
      setError("Please enter login code!")
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: loginCode }),
      });

      const { telegramId, token, username, error, funds } =
        await response.json();

      if (error || !token) {
        setError(error || "Login failed");
        setIsLoading(false);
        return;
      }

      setUserData({
        user_id: telegramId,
        user_name: username,
        funds: funds,
        loading: false,
      });

      setLoginCode("");
      setError("");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  // Updated logoutUser function
  const logoutUser = () => {
    setUserData({
      user_id: null,
      user_name: null,
      funds: 0,
      loading: false,
    });
  };

  return (
    <div className="font-roboto text-xs text-white">
      <div className="flex items-center justify-between bg-[#373a45] h-16 px-4 md:h-24 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="w-20 h-6 md:w-24 md:h-8 bg-center bg-no-repeat bg-auto"
          >
            <img
              src="https://static-00.iconduck.com/assets.00/bet9ja-icon-2048x767-41n3dr8f.png"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex flex-grow mx-4">
          <ul className="flex space-x-1">
            {navItems.map((item, index) => (
              <li key={index} className="relative">
                <a
                  href={item.href}
                  className={`px-1 py-2 text-white font-bold hover:text-blue-400 ${
                    item.active ? "active" : ""
                  }`}
                >
                  {item.label}
                </a>
                {item.tooltip && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded">
                    {item.tooltip}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Account section - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {userData.user_id ? (
            <div className="flex items-center space-x-2">
              <span className="text-white">Welcome, {userData.user_name}</span>
              <div>
                <Funds />
              </div>
              <Link
                href="/history"
                className="text-orange-500 hover:underline hover:cursor-pointer"
              >
                History
              </Link>
              <Button variant="custom" onClick={logoutUser}>
                Logout
              </Button>
            </div>
          ) : (
            //  Dialog Login Box
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="custom">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-[#373a45]">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Login with your telegram account
                  </DialogTitle>
                </DialogHeader>
                <Card className="border-0 shadow-none bg-[#373a45]">
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Button
                        variant="telegram"
                        className="w-full"
                        onClick={() =>
                          window.open(
                            "https://t.me/naijaCoder_bot?start",
                            "_blank"
                          )
                        }
                      >
                        <Send className="mr-2" /> Get Login Code
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="loginCode"
                        type="text"
                        placeholder="Enter Login Code"
                        className="w-full bg-white"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => setChecked(!checked)}
                        id="terms"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        keep me logged in
                      </label>
                    </div>
                    <Button
                      variant="custom"
                      type="submit"
                      className="w-full"
                      onClick={loginUser}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log In"
                      )}
                    </Button>
                    {error && (
                      <p className="text-red-600 text-center text-sm">
                        {error}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#373a45] z-50 p-4">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  <a
                    href={item.href}
                    className={`text-white hover:text-blue-400 ${
                      item.active ? "font-bold" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                    {item.tooltip && (
                      <span className="ml-2 bg-green-500 text-white text-xs px-1 rounded">
                        {item.tooltip}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              {userData.user_id ? (
                <div className="space-y-4">
                  <div className="text-white">
                    Welcome, {userData.user_name}
                  </div>
                  <div>
                    <Funds />
                  </div>
                  <Link
                    href="/history"
                    className="block text-orange-500 hover:underline hover:cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    History
                  </Link>
                  <Button
                    variant="custom"
                    className="w-full"
                    onClick={() => {
                      logoutUser();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="custom" className="w-full">
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-[#373a45]">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Login with your telegram account
                      </DialogTitle>
                    </DialogHeader>
                    <Card className="border-0 shadow-none bg-[#373a45]">
                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Button
                            variant="telegram"
                            className="w-full"
                            onClick={() =>
                              window.open(
                                "https://t.me/naijaCoder_bot?start",
                                "_blank"
                              )
                            }
                          >
                            <Send className="mr-2" /> Get Login Code
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input
                            id="loginCode-mobile"
                            type="text"
                            placeholder="Enter Login Code"
                            className="w-full bg-white"
                            value={loginCode}
                            onChange={(e) => setLoginCode(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => setChecked(!checked)}
                            id="terms-mobile"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="terms-mobile"
                            className="text-sm font-medium text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            keep me logged in
                          </label>
                        </div>
                        <Button
                          variant="custom"
                          type="submit"
                          className="w-full"
                          onClick={loginUser}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            "Log In"
                          )}
                        </Button>
                        {error && (
                          <p className="text-red-600 text-center text-sm">
                            {error}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Header;
