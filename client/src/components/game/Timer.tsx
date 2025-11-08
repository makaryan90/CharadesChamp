import { useEffect, useState } from "react";

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export function Timer({ timeRemaining, totalTime }: TimerProps) {
  const [isPulsing, setIsPulsing] = useState(false);
  const percentage = (timeRemaining / totalTime) * 100;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    setIsPulsing(timeRemaining <= 10 && timeRemaining > 0);
  }, [timeRemaining]);

  return (
    <div className="relative" data-testid="timer">
      <svg width="90" height="90" className={isPulsing ? "animate-pulse" : ""}>
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke={timeRemaining <= 10 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 45 45)"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-2xl font-bold ${timeRemaining <= 10 ? "text-destructive" : "text-foreground"}`}>
          {timeRemaining}
        </span>
      </div>
    </div>
  );
}
