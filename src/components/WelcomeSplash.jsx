import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WelcomeSplash({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [visible, setVisible] = useState(() => {
    const hasSeen = sessionStorage.getItem('hasSeenTripIntro');
    return hasSeen !== 'true';
  });

  useEffect(() => {
    if (!visible) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      let increment = 0;
      if (currentProgress < 30) {
        increment = Math.random() * 8 + 4;
      } else if (currentProgress < 75) {
        increment = Math.random() * 5 + 2;
      } else if (currentProgress < 90) {
        increment = Math.random() * 3 + 1;
      } else {
        increment = Math.random() * 6 + 3;
      }

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(Math.floor(currentProgress));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
        }, 400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (isFinished) {
      sessionStorage.setItem('hasSeenTripIntro', 'true');
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isFinished, onComplete]);

  const scrambleText = (text, currentProgress) => {
    const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const ratio = currentProgress / 100;
    const resolvedLength = Math.floor(text.length * ratio);

    return text
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < resolvedLength) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent text-slate-800 select-none overflow-hidden font-sans">
      
      {/* CodeCat Staggered Vertical Columns Curtain (Light Theme) */}
      <div className="absolute inset-0 flex pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="h-full bg-white flex-1 border-r border-slate-100 last:border-0 dark:bg-slate-900 dark:border-slate-800"
            initial={{ scaleY: 1 }}
            animate={isFinished ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.76, 0, 0.24, 1],
            }}
            style={{ originY: i % 2 === 0 ? 0 : 1 }}
          />
        ))}
      </div>

      {/* CodeCat Warm Glow Circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-orange-400/20 rounded-full blur-[120px] pointer-events-none"
        animate={isFinished ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"
        animate={isFinished ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #8b5cf6 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
        animate={isFinished ? { opacity: 0 } : { opacity: 0.04 }}
      />

      {/* Main Content */}
      <motion.div
        className="flex flex-col items-center max-w-lg px-4 text-center z-10 space-y-4"
        animate={isFinished ? { opacity: 0, scale: 0.92, y: -15 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Glowing Logo */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-orange-300/40 rounded-full blur-2xl transform scale-90 animate-pulse" />
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 fill-none stroke-orange-500 relative z-10"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Code Brackets */}
            <motion.path
              d="M 15,35 L 5,45 L 15,55"
              className="stroke-purple-500/70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.path
              d="M 85,35 L 95,45 L 85,55"
              className="stroke-purple-500/70"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Compass / Travel Icon outline */}
            <motion.circle
              cx="50"
              cy="48"
              r="22"
              className="stroke-orange-500"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
            <motion.polygon
              points="50,34 55,48 50,62 45,48"
              className="fill-purple-500 stroke-purple-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-orange-400 font-sans h-12">
          {scrambleText("旅遊筆記", progress)}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-400 tracking-[0.15em] font-medium uppercase h-6">
          {scrambleText("TRAVEL ITINERARY PLATFORM", progress)}
        </p>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 flex flex-col items-center pt-4">
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-2xl font-semibold text-orange-500 font-mono">
              {progress}
            </span>
            <span className="text-xs text-slate-400">%</span>
          </div>

          <div className="w-full h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-4 animate-pulse">
            Initializing System Modules...
          </span>
        </div>
      </motion.div>
    </div>
  );
}
