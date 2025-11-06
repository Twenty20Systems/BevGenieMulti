'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Database, Target, Sparkles, Layers, CheckCircle2, Clock, FileText, Users, TrendingUp, Zap, Search, Filter, Cpu, GitBranch, BarChart3, FileSearch } from 'lucide-react';

const BevGenieVisualLoader = ({ query, onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stageData, setStageData] = useState({});
  const [floatingItems, setFloatingItems] = useState([]);
  const [dataFlow, setDataFlow] = useState([]);

  const stages = [
    {
      id: 'understanding',
      icon: Search,
      title: 'Understanding Your Question',
      duration: 2000,
      color: '#00C8FF',
      visualElements: [
        { icon: FileText, label: 'Query Analysis', delay: 0 },
        { icon: Target, label: 'Intent Detection', delay: 200 },
        { icon: Filter, label: 'Context Extraction', delay: 400 }
      ],
      insight: 'Analyzing: "Field Execution ROI Analysis"',
      metrics: { keywords: 7, patterns: 3 }
    },
    {
      id: 'persona',
      icon: Users,
      title: 'Detecting Your Persona',
      duration: 2200,
      color: '#AA6C39',
      visualElements: [
        { icon: Users, label: 'Craft Supplier', delay: 0 },
        { icon: TrendingUp, label: 'Sales Focus', delay: 200 },
        { icon: Target, label: 'Pain Points', delay: 400 }
      ],
      insight: 'Identified: Craft Supplier • Sales Focus',
      metrics: { confidence: 87, signals: 5 }
    },
    {
      id: 'research',
      icon: Database,
      title: 'Gathering Intelligence',
      duration: 2500,
      color: '#198038',
      visualElements: [
        { icon: FileSearch, label: '50K+ Articles', delay: 0 },
        { icon: Database, label: 'Research DB', delay: 200 },
        { icon: BarChart3, label: 'Benchmarks', delay: 400 },
        { icon: FileText, label: 'Case Studies', delay: 600 }
      ],
      insight: 'Scanning knowledge base: 15 matches found',
      metrics: { articles: 15, relevance: 94 }
    },
    {
      id: 'personalizing',
      icon: Sparkles,
      title: 'Personalizing Solutions',
      duration: 2000,
      color: '#00C8FF',
      visualElements: [
        { icon: GitBranch, label: 'Pain Point #1', delay: 0 },
        { icon: Zap, label: 'Feature Match', delay: 200 },
        { icon: Sparkles, label: 'Insights', delay: 400 }
      ],
      insight: 'Matched 4 features to solve your challenges',
      metrics: { features: 4, painPoints: 2 }
    },
    {
      id: 'building',
      icon: Layers,
      title: 'Crafting Your Experience',
      duration: 2300,
      color: '#AA6C39',
      visualElements: [
        { icon: Layers, label: 'Layout', delay: 0 },
        { icon: BarChart3, label: 'Visualizations', delay: 200 },
        { icon: FileText, label: 'Content', delay: 400 },
        { icon: Sparkles, label: 'Polish', delay: 600 }
      ],
      insight: 'Assembling 6 custom components',
      metrics: { components: 6, visualizations: 3 }
    }
  ];

  useEffect(() => {
    // Generate initial floating items
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.3 + 0.2,
      duration: Math.random() * 3 + 2
    }));
    setFloatingItems(items);
  }, []);

  useEffect(() => {
    let progressInterval;
    let stageTimeout;

    const advanceStage = (stageIndex) => {
      if (stageIndex >= stages.length) {
        setTimeout(onComplete, 1000);
        return;
      }

      const stage = stages[stageIndex];
      setCurrentStage(stageIndex);

      // Show stage data after delay
      setTimeout(() => {
        setStageData(prev => ({
          ...prev,
          [stage.id]: {
            insight: stage.insight,
            metrics: stage.metrics,
            visualElements: stage.visualElements
          }
        }));
      }, 400);

      // Animate data flow
      if (stage.visualElements) {
        stage.visualElements.forEach((element, idx) => {
          setTimeout(() => {
            setDataFlow(prev => [...prev, { id: `${stage.id}-${idx}`, ...element }]);
          }, element.delay);
        });
      }

      // Animate progress
      const stepDuration = stage.duration / 100;
      let currentProgress = 0;

      progressInterval = setInterval(() => {
        currentProgress += 1;
        setProgress(((stageIndex + (currentProgress / 100)) / stages.length) * 100);

        if (currentProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, stepDuration);

      // Move to next stage
      stageTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        setDataFlow([]);
        advanceStage(stageIndex + 1);
      }, stage.duration);
    };

    advanceStage(0);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimeout);
    };
  }, []);

  const currentStageInfo = stages[currentStage];
  const data = stageData[currentStageInfo?.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1930] bg-opacity-95 backdrop-blur-sm overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingItems.map(item => (
          <div
            key={item.id}
            className="absolute w-1 h-1 bg-[#00C8FF] rounded-full animate-float"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.size}px`,
              height: `${item.size}px`,
              opacity: item.opacity,
              animationDuration: `${item.duration}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-6xl px-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A1930] to-[#002244] px-8 py-6 relative overflow-hidden">
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(#00C8FF 1px, transparent 1px), linear-gradient(90deg, #00C8FF 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                animation: 'slide-grid 20s linear infinite'
              }} />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Animated Genie Icon */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00C8FF] to-[#0A1930] flex items-center justify-center shadow-lg">
                      <Brain className="w-7 h-7 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#198038] rounded-full border-2 border-white animate-ping" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#198038] rounded-full border-2 border-white" />
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-xl">BevGenie AI at Work</h3>
                    <p className="text-white/70 text-sm">Creating your personalized intelligence dashboard</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-[#00C8FF]" />
                    <span className="text-white/90 text-sm font-medium">~{10 - Math.floor(progress / 10)}s</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                  <span>Overall Progress</span>
                  <span className="font-mono font-bold text-[#00C8FF] text-lg">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur">
                  <div
                    className="h-full bg-gradient-to-r from-[#00C8FF] to-[#00E5FF] transition-all duration-300 ease-out relative rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/40 blur-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-5 divide-x divide-gray-200">
            {/* Left Side - Stage List */}
            <div className="col-span-2 p-6 bg-gray-50 space-y-3 max-h-[500px] overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Processing Pipeline
              </h4>
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === currentStage;
                const isComplete = index < currentStage;

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white shadow-md border-2 border-[#00C8FF]'
                        : isComplete
                        ? 'bg-white border border-green-200'
                        : 'bg-gray-100 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isComplete
                          ? 'bg-[#198038]'
                          : isActive
                          ? 'bg-[#00C8FF]'
                          : 'bg-gray-300'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 text-white ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#0A1930]' : 'text-gray-700'}`}>
                        {stage.title}
                      </p>
                      {isComplete && (
                        <p className="text-xs text-green-600 mt-0.5">✓ Complete</p>
                      )}
                      {isActive && (
                        <div className="flex gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side - Active Stage Visualization */}
            <div className="col-span-3 p-8 bg-white">
              {currentStageInfo && (
                <div className="h-full flex flex-col">
                  {/* Stage Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      {React.createElement(currentStageInfo.icon, {
                        className: 'w-8 h-8 animate-pulse',
                        style: { color: currentStageInfo.color }
                      })}
                      <h3 className="text-2xl font-bold text-[#0A1930]">
                        {currentStageInfo.title}
                      </h3>
                    </div>
                    {data?.insight && (
                      <p className="text-gray-600 text-sm flex items-center gap-2 animate-fade-in">
                        <Zap className="w-4 h-4 text-[#00C8FF]" />
                        {data.insight}
                      </p>
                    )}
                  </div>

                  {/* Visual Elements - What AI is doing */}
                  <div className="flex-1 relative">
                    {data?.visualElements && (
                      <div className="grid grid-cols-2 gap-4">
                        {data.visualElements.map((element, idx) => {
                          const ElementIcon = element.icon;
                          const isVisible = dataFlow.some(df => df.label === element.label);

                          return (
                            <div
                              key={idx}
                              className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                                isVisible
                                  ? 'border-[#00C8FF] bg-blue-50 scale-100 opacity-100'
                                  : 'border-gray-200 bg-gray-50 scale-95 opacity-30'
                              }`}
                              style={{
                                transitionDelay: `${element.delay}ms`
                              }}
                            >
                              {/* Scanning effect */}
                              {isVisible && (
                                <div className="absolute inset-0 overflow-hidden rounded-xl">
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00C8FF]/20 to-transparent animate-scan" />
                                </div>
                              )}

                              <div className="relative flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor: isVisible ? `${currentStageInfo.color}20` : '#f3f4f6',
                                    color: isVisible ? currentStageInfo.color : '#9ca3af'
                                  }}
                                >
                                  <ElementIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-[#0A1930]">
                                    {element.label}
                                  </p>
                                  {isVisible && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                      <span className="text-xs text-gray-500">Processing</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Metrics Display */}
                    {data?.metrics && (
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {Object.entries(data.metrics).map(([key, value]) => (
                          <div
                            key={key}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 animate-fade-in"
                          >
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-2xl font-bold text-[#0A1930]">
                              {typeof value === 'number' && value < 50 ? value : `${value}${typeof value === 'number' && value > 50 ? '%' : ''}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#0A1930]">Query:</span> {query}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-[#198038] rounded-full animate-pulse" />
                <span>AI Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes slide-grid {
          0% { transform: translateX(0); }
          100% { transform: translateX(20px); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export { BevGenieVisualLoader };
