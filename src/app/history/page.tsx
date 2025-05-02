import React from "react";
import { Coffee, ExternalLink } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="w-full bg-black text-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-6">
          Public Free Version
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          Navigate to Buy Me Coffee for the full version
        </p>

        <a
          href="https://www.buymeacoffee.com/yourname"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg"
        >
          <Coffee className="h-5 w-5 mr-2" />
          Buy Me a Coffee
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>
    </div>
  );
}
