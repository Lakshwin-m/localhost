import { useState, useEffect } from "react";

interface CountdownTimerProps {
  matrixMode?: boolean;
}

const CountdownTimer = ({ matrixMode = false }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set a fixed target date - change this to your desired launch date
    // Example: July 10, 2025 at 12:00 PM
    const targetDate = new Date("2025-07-30T12:00:00").getTime();

    // Alternative: If you want 7 days from a specific date, uncomment below:
    // const targetDate = new Date('2025-07-03T12:00:00').getTime() + 7 * 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div
      className={`flex flex-col items-center space-y-12 ${
        matrixMode ? "text-white" : ""
      }`}
    >
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        <div className="text-center">
          <div
            className={`text-4xl md:text-7xl font-light font-jetbrains mb-4`}
          >
            {formatNumber(timeLeft.days)}
          </div>
          <div className={`text-sm md:text-base uppercase tracking-widest`}>
            Days
          </div>
        </div>

        <div className="text-center">
          <div
            className={`text-4xl md:text-7xl font-light font-jetbrains mb-4`}
          >
            {formatNumber(timeLeft.hours)}
          </div>
          <div className={`text-sm md:text-base uppercase tracking-widest`}>
            Hours
          </div>
        </div>

        <div className="text-center">
          <div
            className={`text-4xl md:text-7xl font-light font-jetbrains mb-4`}
          >
            {formatNumber(timeLeft.minutes)}
          </div>
          <div className={`text-sm md:text-base uppercase tracking-widest`}>
            Minutes
          </div>
        </div>

        <div className="text-center">
          <div
            className={`text-4xl md:text-7xl font-light font-jetbrains mb-4`}
          >
            {formatNumber(timeLeft.seconds)}
          </div>
          <div className={`text-sm md:text-base uppercase tracking-widest`}>
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
