"use client";

import { useEffect, useState } from "react";

/**
 * Live Bangalore clock (Asia/Kolkata), ticking every second. Renders a stable
 * placeholder on the server so hydration matches, then starts on mount.
 */
export default function LocalTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </span>
  );
}
