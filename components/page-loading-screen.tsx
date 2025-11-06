'use client';

import React, { useState, useEffect } from 'react';

export type LoaderStyle = 'neural-network' | 'chemical-reaction' | 'holographic';

export interface PageLoadingScreenProps {
  isVisible: boolean;
  style?: LoaderStyle;
  stages?: LoadingStage[];
  currentStage?: number;
  onComplete?: () => void;
}

export interface LoadingStage {
  name: string;
  duration: number; // milliseconds
}

const DEFAULT_STAGES: LoadingStage[] = [
  { name: 'Understanding Query', duration: 2000 },
  { name: 'Analyzing Persona', duration: 2000 },
  { name: 'Researching Context', duration: 3000 },
  { name: 'Personalizing Content', duration: 2000 },
  { name: 'Building Dashboard', duration: 3000 },
];

/**
 * Page Loading Screen Component
 *
 * Shows creative animations while AI generates pages
 * Supports three animation styles:
 * 1. Neural Network - AI processing visualization
 * 2. Chemical Reaction - Laboratory formula brewing
 * 3. Holographic - 3D component assembly
 */
export function PageLoadingScreen({
  isVisible,
  style = 'neural-network',
  stages = DEFAULT_STAGES,
  currentStage = 0,
  onComplete,
}: PageLoadingScreenProps) {
  const [displayStage, setDisplayStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setDisplayStage(0);
      setProgress(0);
      return;
    }

    // Calculate total duration
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    let elapsed = 0;

    stages.forEach((stage, index) => {
      const timeout = setTimeout(() => {
        setDisplayStage(index);
        const newProgress = Math.round(((elapsed + stage.duration) / totalDuration) * 100);
        setProgress(Math.min(newProgress, 100));

        if (index === stages.length - 1) {
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }, elapsed);

      elapsed += stage.duration;

      return () => clearTimeout(timeout);
    });
  }, [isVisible, stages, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4">
        {/* Loader Animation */}
        <div className="mb-8">
          {style === 'neural-network' && (
            <NeuralNetworkLoader displayStage={displayStage} />
          )}
          {style === 'chemical-reaction' && (
            <ChemicalReactionLoader progress={progress} />
          )}
          {style === 'holographic' && (
            <HolographicLoader displayStage={displayStage} stages={stages} />
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right mt-2 text-xs text-gray-600">
            {progress}%
          </div>
        </div>

        {/* Current Stage */}
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-900">
            {stages[displayStage]?.name || 'Processing...'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Step {displayStage + 1} of {stages.length}
          </p>
        </div>

        {/* Stage Indicators */}
        <div className="flex gap-2 justify-center">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index < displayStage
                  ? 'bg-green-500'
                  : index === displayStage
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Fun Tip */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            💡 <strong>Pro Tip:</strong> BevGenie is analyzing{' '}
            {displayStage === 0
              ? 'your question'
              : displayStage === 1
                ? 'your company profile'
                : displayStage === 2
                  ? 'market insights'
                  : displayStage === 3
                    ? 'personalized content'
                    : 'your dashboard'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Neural Network Loader
 * Visualizes AI processing as neurons activating
 */
function NeuralNetworkLoader({ displayStage }: { displayStage: number }) {
  const layers = 5;
  const neuronsPerLayer = 5;

  return (
    <div className="flex justify-around items-center h-40">
      {Array.from({ length: layers }).map((_, layerIndex) => (
        <div key={layerIndex} className="flex flex-col gap-2 items-center">
          {Array.from({ length: neuronsPerLayer }).map((_, neuronIndex) => {
            const isActive = layerIndex <= displayStage;
            const delay = (neuronIndex * 100) % 400;

            return (
              <div
                key={`${layerIndex}-${neuronIndex}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-500 shadow-lg shadow-blue-500'
                    : 'bg-gray-300'
                }`}
                style={{
                  animation: isActive ? `pulse 1s ease-in-out infinite` : 'none',
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          })}

          {/* Connecting Lines */}
          {layerIndex < layers - 1 && (
            <div
              className={`absolute w-8 h-0.5 ${
                layerIndex < displayStage ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'
              }`}
              style={{
                left: `${(layerIndex + 1) * 60 - 20}px`,
                top: '50%',
              }}
            />
          )}
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

/**
 * Chemical Reaction Loader
 * Visualizes AI as brewing a formula
 */
function ChemicalReactionLoader({ progress }: { progress: number }) {
  const flaskFillPercentage = progress;

  // Determine color based on progress
  const getFlaskColor = () => {
    if (progress < 33) return 'from-blue-400 to-blue-500';
    if (progress < 66) return 'from-purple-400 to-purple-500';
    return 'from-green-400 to-green-500';
  };

  return (
    <div className="flex justify-center items-center h-40">
      {/* Flask Container */}
      <div className="relative w-24 h-40">
        {/* Flask Outline */}
        <svg
          viewBox="0 0 100 160"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        >
          {/* Flask Body */}
          <path
            d="M 30 40 L 20 60 L 20 140 Q 20 150 30 150 L 70 150 Q 80 150 80 140 L 80 60 L 70 40 Z"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Flask Fill */}
          <defs>
            <linearGradient
              id="flaskGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" className={`stop-color-start ${getFlaskColor()}`} />
              <stop offset="100%" className={`stop-color-end ${getFlaskColor()}`} />
            </linearGradient>
          </defs>

          {/* Animated Fill */}
          <path
            d={`M 30 ${140 - (flaskFillPercentage * 1)} L 20 ${60 + (flaskFillPercentage * 0.8)} L 20 140 Q 20 150 30 150 L 70 150 Q 80 150 80 140 L 80 ${60 + (flaskFillPercentage * 0.8)} L 70 ${140 - (flaskFillPercentage * 1)} Z`}
            fill="url(#flaskGradient)"
            opacity="0.8"
            className="transition-all duration-500"
          />

          {/* Flask Top */}
          <rect x="45" y="20" width="10" height="25" fill="#e5e7eb" />
          <circle cx="50" cy="20" r="5" fill="#e5e7eb" />
        </svg>

        {/* Bubbles */}
        {[...Array(Math.floor(progress / 20) + 1)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: `${8 - i * 2}px`,
              height: `${8 - i * 2}px`,
              left: `${30 + (i * 15) % 40}px`,
              animation: `float-up 2s ease-in infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        <style>{`
          @keyframes float-up {
            0% {
              bottom: -10px;
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              bottom: 100px;
              opacity: 0;
            }
          }
          .stop-color-start.from-blue-400 { stop-color: #60a5fa; }
          .stop-color-end.from-blue-500 { stop-color: #3b82f6; }
          .stop-color-start.from-purple-400 { stop-color: #a78bfa; }
          .stop-color-end.from-purple-500 { stop-color: #8b5cf6; }
          .stop-color-start.from-green-400 { stop-color: #4ade80; }
          .stop-color-end.from-green-500 { stop-color: #22c55e; }
        `}</style>
      </div>
    </div>
  );
}

/**
 * Holographic Loader
 * Visualizes AI as assembling 3D components
 */
function HolographicLoader({
  displayStage,
  stages,
}: {
  displayStage: number;
  stages: LoadingStage[];
}) {
  const components = [
    '📊 Hero',
    '🎯 Features',
    '💬 Testimonial',
    '📈 Metrics',
    '🔘 CTA',
    '❓ FAQ',
  ];

  return (
    <div className="flex justify-center items-center h-40 perspective">
      {/* Central Brain */}
      <div className="absolute w-12 h-12 flex items-center justify-center">
        <div
          className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold animate-pulse"
          style={{
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          🧠
        </div>
      </div>

      {/* Floating Components */}
      {components.map((component, index) => {
        const isVisible = index <= displayStage;
        const angle = (index / components.length) * Math.PI * 2;
        const x = Math.cos(angle) * 60;
        const y = Math.sin(angle) * 60;

        return (
          <div
            key={index}
            className={`absolute w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-500 ${
              isVisible
                ? 'bg-white border-2 border-blue-500 shadow-lg opacity-100'
                : 'bg-gray-200 border-2 border-gray-300 shadow-sm opacity-50'
            }`}
            style={{
              transform: isVisible
                ? `translate(${x}px, ${y}px) rotateZ(${index * 30}deg)`
                : 'translate(0, 0) rotateZ(0deg)',
              fontSize: '20px',
            }}
          >
            {component.split(' ')[0]}
          </div>
        );
      })}

      {/* Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 200 160"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="200" height="160" fill="url(#grid)" />
      </svg>

      {/* Progress Counter */}
      <div className="absolute bottom-0 text-center">
        <p className="text-xs font-semibold text-blue-600">
          {displayStage + 1} / {components.length} COMPONENTS
        </p>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }
      `}</style>
    </div>
  );
}
