'use client';

import React, { useState } from 'react';
import { Home, ChevronUp } from 'lucide-react';
import { DynamicForm } from './dynamic-form';
import { SubmissionType } from '@/lib/forms/form-config';

interface Insight {
  text: string;
}

interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface VisualContent {
  type: 'highlight_box' | 'case_study' | 'example';
  title: string;
  content: string;
  highlight?: string;
}

interface CTA {
  text: string;
  type: 'primary' | 'secondary' | 'tertiary';
  action: 'form' | 'new_section' | 'chat' | 'explore';
  submissionType?: SubmissionType;
  context?: any;
}

interface MultiScreenSectionProps {
  headline: string;
  subtitle: string;
  insights: Insight[];
  stats: Stat[];
  visualContent: VisualContent;
  howItWorks?: string[];
  ctas: CTA[];
  onBackToHome?: () => void;
  onCTAClick?: (action: string, context?: any) => void;
}

/**
 * Multi-Screen Section Component
 *
 * Allows natural scrolling without 100vh constraint.
 * Uses talk2me.dog color scheme: #0A1930 (Navy), #00C8FF (Cyan), #AA6C39 (Copper)
 */
export function MultiScreenSection({
  headline,
  subtitle,
  insights,
  stats,
  visualContent,
  howItWorks,
  ctas,
  onBackToHome,
  onCTAClick
}: MultiScreenSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [activeSubmissionType, setActiveSubmissionType] = useState<SubmissionType>('demo');

  const handleCTAClick = (cta: CTA) => {
    if (cta.action === 'form' && cta.submissionType) {
      setActiveSubmissionType(cta.submissionType);
      setShowForm(true);
    } else if (onCTAClick) {
      onCTAClick(cta.action, cta.context || { text: cta.text });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#0A1930] to-[#000000] relative py-8">

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#0A1930]/95 backdrop-blur-sm border-b border-white/10 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 max-w-[80%]">
            <h1 className="text-4xl font-bold text-white leading-tight break-words">
              {headline}
            </h1>
            <p className="text-[#00C8FF] text-sm mt-2">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleScrollToTop}
              className="text-white/60 hover:text-[#00C8FF] transition-colors p-2 rounded-lg hover:bg-white/5"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={onBackToHome}
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
              aria-label="Back to home"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Natural Flow */}
      <div className="px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Key Insights Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-10">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-[#00C8FF]">→</span>
              Key Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#00C8FF]/5 to-transparent p-6 rounded-lg border border-[#00C8FF]/20 hover:border-[#00C8FF]/40 transition-all"
                >
                  <div className="flex gap-3 items-start">
                    <div className="text-[#00C8FF] text-xl flex-shrink-0 mt-0.5">✦</div>
                    <p className="text-white/90 text-base leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#00C8FF]/10 to-transparent backdrop-blur p-8 rounded-xl border border-[#00C8FF]/30 hover:border-[#00C8FF]/60 hover:-translate-y-2 transition-all cursor-default"
              >
                <div className="text-5xl font-bold text-[#00C8FF] mb-3">{stat.value}</div>
                <div className="text-base text-white/80 font-medium mb-2">{stat.label}</div>
                {stat.description && (
                  <div className="text-sm text-white/60 leading-relaxed">{stat.description}</div>
                )}
              </div>
            ))}
          </div>

          {/* Visual Content / Case Study */}
          <div className="bg-gradient-to-br from-[#AA6C39]/10 via-[#00C8FF]/5 to-transparent p-10 rounded-xl border border-[#00C8FF]/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-[#AA6C39]">◆</span>
              {visualContent.title}
            </h3>
            <div className="space-y-6">
              <p className="text-white/80 text-lg leading-relaxed">
                {visualContent.content}
              </p>
              {visualContent.highlight && (
                <div className="bg-[#00C8FF]/10 p-6 rounded-lg border-l-4 border-[#00C8FF]">
                  <div className="text-[#00C8FF] font-bold text-base mb-3">Key Result:</div>
                  <div className="text-white/90 text-lg leading-relaxed font-medium">{visualContent.highlight}</div>
                </div>
              )}
            </div>
          </div>

          {/* How It Works */}
          {howItWorks && howItWorks.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-xl border border-white/10">
              <div className="text-[#00C8FF] font-bold text-2xl mb-6 flex items-center gap-3">
                <span className="text-3xl">✦</span>
                <span>How This Works For You</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {howItWorks.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-lg">
                    <div className="text-[#00C8FF] font-bold text-lg flex-shrink-0">{idx + 1}.</div>
                    <p className="text-white/80 text-base leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs Section */}
          <div className="bg-gradient-to-r from-[#00C8FF]/10 to-[#AA6C39]/10 p-10 rounded-xl border border-[#00C8FF]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4 flex-wrap">
                {ctas.map((cta, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCTAClick(cta)}
                    className={`px-8 py-4 font-bold text-lg rounded-lg transition-all transform hover:scale-105 ${
                      cta.type === 'primary'
                        ? 'bg-[#00C8FF] text-[#0A1930] hover:bg-[#00B8EF] shadow-lg'
                        : cta.type === 'secondary'
                        ? 'bg-[#AA6C39] text-white hover:bg-[#AA6C39]/90 shadow-lg'
                        : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20'
                    }`}
                    aria-label={cta.text}
                  >
                    {cta.text}
                  </button>
                ))}
              </div>

              {/* Alternative action */}
              <div className="text-white/70 text-base">
                or{' '}
                <button
                  onClick={() => onCTAClick && onCTAClick('chat', { source: 'section_footer' })}
                  className="text-[#00C8FF] hover:text-[#00B8EF] underline font-semibold"
                >
                  ask a specific question
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Form Modal */}
      {showForm && (
        <DynamicForm
          onClose={() => setShowForm(false)}
          submissionType={activeSubmissionType}
          context={`Interest from: ${headline}`}
          sourcePage={subtitle}
        />
      )}
    </section>
  );
}
