import { useState, useEffect } from "react";
import CountdownTimer from "../components/CountdownTimer";

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [matrixMode, setMatrixMode] = useState(false);

  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  // Handle both keyboard and mobile input for Konami code
  const handleKonamiInput = (input: string) => {
    const newCode = [...konamiCode, input].slice(-10);
    setKonamiCode(newCode);

    // Visual feedback for mobile: vibrate on input
    if (window.navigator && "vibrate" in window.navigator) {
      window.navigator.vibrate(30);
    }

    // Check progress for visual highlight
    const correctSoFar = newCode.every(
      (val, idx) => val === konamiSequence[idx]
    );

    // If wrong input, vibrate longer and reset
    if (!correctSoFar && newCode.length > 0) {
      if (window.navigator && "vibrate" in window.navigator) {
        window.navigator.vibrate([100, 50, 100]);
      }
      setKonamiCode([]);
      return;
    }

    if (newCode.join(",") === konamiSequence.join(",")) {
      setMatrixMode(!matrixMode);
      setKonamiCode([]);
    }
  };

  // Konami Code detection (keyboard)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      handleKonamiInput(e.code);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [konamiCode, matrixMode]);

  // Click counter easter egg
  const handleBackgroundClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount === 9) {
      setShowEasterEgg(true);
      setClickCount(0);
    }
  };

  // Show Konami input only after 10 clicks (persist after closing popup)
  const [showKonamiInput, setShowKonamiInput] = useState(false);

  // Update showKonamiInput when easter egg is triggered
  useEffect(() => {
    if (showEasterEgg) {
      setShowKonamiInput(true);
    }
  }, [showEasterEgg]);

  // Generate floating particles
  const generateParticles = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
        }}
      />
    ));
  };

  // Matrix rain effect
  const MatrixRain = () => {
    const characters =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute text-green-400 text-sm font-mono animate-matrix-fall opacity-60"
            style={{
              left: `${i * 3.33}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            {Array.from({ length: 20 }, (_, j) => (
              <div key={j} className="block">
                {characters[Math.floor(Math.random() * characters.length)]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`w-full h-screen relative overflow-hidden transition-all duration-1000 ${
        matrixMode ? "bg-black" : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
      onClick={handleBackgroundClick}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(59, 130, 246, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Particles */}
      {!matrixMode && generateParticles()}

      {/* Matrix Rain Effect */}
      {matrixMode && <MatrixRain />}

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div
          className={`text-center space-y-8 ${matrixMode ? "text-white" : ""}`}
        >
          <div
            className={`text-6xl font-mono font-bold tracking-wider mb-8 transition-all duration-500 ${
              matrixMode ? "text-white" : "text-gray-800"
            }`}
          >
            ./localhost
          </div>
          <CountdownTimer matrixMode={matrixMode} />
          <div
            className={`text-lg font-mono mt-8 transition-all duration-500 ${
              matrixMode ? "text-green-300" : "text-gray-600"
            }`}
          >
            {matrixMode
              ? "MATRIX MODE ACTIVATED"
              : "Stay tuned. Something timeless is coming."}
          </div>
          <div
            className={`text-sm mt-4 ${
              matrixMode ? "text-white" : "text-gray-500"
            }`}
          >
            Dont forget to click around!
          </div>
        </div>
      </div>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center animate-bounce relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              onClick={() => setShowEasterEgg(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-2xl font-bold mb-2">Easter Egg Found!</div>
            <div className="text-gray-600">
              You clicked 10 times! Nice persistence!
            </div>
            <div className="text-sm mt-4 text-gray-500">
              Try the Konami Code: ↑↑↓↓←→←→BA
            </div>
          </div>
        </div>
      )}

      {/* Mobile Konami Code Input */}
      {!matrixMode && showKonamiInput && (
        <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-30 md:hidden select-none pointer-events-auto">
          {/* Sequence Progress Bar */}
          <div className="flex justify-center mb-1 gap-1">
            {konamiSequence.map((btn, idx) => {
              const icons: Record<string, string> = {
                ArrowUp: "↑",
                ArrowDown: "↓",
                ArrowLeft: "←",
                ArrowRight: "→",
                KeyB: "B",
                KeyA: "A",
              };
              const isActive = konamiCode[idx] === btn;
              const isNext = konamiCode.length === idx;
              return (
                <span
                  key={idx}
                  className={`w-7 h-7 flex items-center justify-center rounded-full border text-lg font-bold mx-0.5
                    ${
                      isActive
                        ? "bg-green-500 text-white border-green-500"
                        : isNext
                        ? "border-blue-400 text-blue-400"
                        : "border-gray-500 text-gray-500"
                    }
                  `}
                  style={{ transition: "all 0.2s" }}
                >
                  {icons[btn]}
                </span>
              );
            })}
          </div>
          {/* Input Buttons */}
          <div className="flex justify-center items-center gap-2 py-2 px-2 bg-black bg-opacity-60 rounded-t-xl shadow-lg">
            {[
              { label: "↑", code: "ArrowUp" },
              { label: "↓", code: "ArrowDown" },
              { label: "←", code: "ArrowLeft" },
              { label: "→", code: "ArrowRight" },
              { label: "B", code: "KeyB" },
              { label: "A", code: "KeyA" },
            ].map((btn) => (
              <button
                key={btn.code}
                className="text-white text-xl font-bold bg-gray-800 bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center active:bg-gray-600 focus:outline-none"
                onClick={() => handleKonamiInput(btn.code)}
                aria-label={btn.label}
                style={{ touchAction: "manipulation" }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes matrix-fall {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-matrix-fall {
          animation: matrix-fall 10s linear infinite;
        }

        .animate-bounce {
          animation: bounce 0.5s ease-in-out;
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
