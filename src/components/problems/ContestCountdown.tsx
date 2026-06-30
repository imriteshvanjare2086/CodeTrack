import { useEffect, useState } from "react";

interface ContestCountdownProps {
  startTime: number; // timestamp in ms
}

export function ContestCountdown({ startTime }: ContestCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    function calculateTimeLeft() {
      const difference = startTime - Date.now();
      if (difference <= 0) {
        setTimeLeft("Started");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(" "));
    }

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <span className="font-mono font-black text-primary text-xl tabular-nums tracking-tight">
      {timeLeft || "--"}
    </span>
  );
}
