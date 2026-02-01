import React from 'react';
import { clsx } from 'clsx';

interface RiskGaugeProps {
  score: number; // 0 to 3
  level: string;
}

export default function RiskGauge({ score, level }: RiskGaugeProps) {
  // Normalize score to 0-100% for the gauge
  // Range is roughly 0.0 to 3.0
  const normalizedScore = Math.min(Math.max(score / 3, 0), 1);
  const rotation = normalizedScore * 180; // 0 to 180 degrees

  const getColor = (s: number) => {
    if (s < 0.5) return 'text-emerald-500';
    if (s < 1.5) return 'text-blue-500';
    if (s < 2.5) return 'text-amber-500';
    return 'text-rose-600';
  };

  const getBorderColor = (s: number) => {
    if (s < 0.5) return 'border-emerald-500';
    if (s < 1.5) return 'border-blue-500';
    if (s < 2.5) return 'border-amber-500';
    return 'border-rose-600';
  };

  const colorClass = getColor(score);
  const borderClass = getBorderColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative py-6">
      {/* Semi Circle Gauge Background */}
      <div className="w-48 h-24 overflow-hidden relative">
        <div className="w-48 h-48 rounded-full border-[12px] border-gray-100 absolute top-0 left-0"></div>
        <div 
            className={clsx("w-48 h-48 rounded-full border-[12px] absolute top-0 left-0 transition-transform duration-1000 ease-out border-b-transparent border-r-transparent border-l-transparent", borderClass)}
            style={{ transform: `rotate(${rotation - 180}deg)` }}
        ></div>
      </div>
      
      {/* Score Text */}
      <div className="text-center mt-2">
        <div className={clsx("text-4xl font-extrabold", colorClass)}>
          {level}
        </div>
        <p className="text-gray-400 text-sm mt-1">Severity Index: {score.toFixed(2)}</p>
      </div>
    </div>
  );
}