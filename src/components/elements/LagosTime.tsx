"use client";

import { useState, useEffect } from "react";

export default function LagosTime() {
  const [timeData, setTimeData] = useState({
    time: "",
    date: "",
  });

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const now = new Date();

      // Format time for Lagos
      const timeFormatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Africa/Lagos",
      });

      // Format date for Lagos
      const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
        timeZone: "Africa/Lagos",
      });

      setTimeData({
        time: `${timeFormatter.format(now)} Africa/Lagos`,
        date: dateFormatter.format(now),
      });
    };

    // Update immediately
    updateTime();

    // Then update every second
    const interval = setInterval(updateTime, 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" pt-2 px-2 flex flex-row">
      {/* <h1 className="font-bold mb-3">Lagos, Nigeria</h1> */}
      <h1 className="text-xs font-mono">{timeData.time}</h1>
      {/* <p className="text-lg text-gray-600">{timeData.date}</p> */}
    </div>
  );
}
