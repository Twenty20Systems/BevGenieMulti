'use client';

import React, { useState } from 'react';
import { Home, ChevronUp, X } from 'lucide-react';
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

interface SingleScreenSectionProps {
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
 * Single Screen Section Component
 *
 * Displays exactly one screen (100vh) with all content visible without scrolling
 */
export function SingleScreenSection({
  headline,
  subtitle,
  insights,
  stats,
  visualContent,
  howItWorks,
  ctas,
  onBackToHome,
  onCTAClick
}: SingleScreenSectionProps) {
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
    <section className="min-h-screen w-full bg-[#0A1930] relative flex flex-col snap-start">

      {/* Header - Fixed */}
      <div className="min-h-[100px] px-12 pt-8 pb-6 flex items-center justify-between border-b border-white/10 relative z-10 flex-shrink-0">
        <div className="flex-1 max-w-[80%]">
          <h1 className="text-4xl font-bold text-white leading-tight line-clamp-2 break-words" title={headline}>
            {headline}
          </h1>
          <p className="text-[#00C8FF] text-sm mt-1 truncate" title={subtitle}>
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

      {/* Main Content Area - Scrollable with max-height and proper overflow handling */}
      <div className="flex-1 px-12 py-8 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8 min-h-0">

          {/* Left Column - Primary Content */}
          <div className="flex flex-col justify-between h-full min-h-0">

            {/* Key Insights */}
            <div className="flex-1 mb-6 min-h-0 overflow-y-auto">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Key Insights
              </h2>
              <div className="space-y-4">
                {insights.slice(0, 4).map((insight, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="text-[#00C8FF] text-xl flex-shrink-0 mt-0.5">→</div>
                    <p className="text-white/80 text-base leading-relaxed break-words">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats - Always at bottom */}
            <div className="grid grid-cols-3 gap-4 flex-shrink-0">
              {stats.slice(0, 3).map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10 hover:border-[#00C8FF]/50 hover:-translate-y-1 transition-all cursor-default"
                >
                  <div className="text-3xl font-bold text-[#00C8FF] mb-1 truncate" title={stat.value}>{stat.value}</div>
                  <div className="text-sm text-white/60 line-clamp-2" title={stat.label}>{stat.label}</div>
                  {stat.description && (
                    <div className="text-xs text-white/40 mt-1 truncate" title={stat.description}>{stat.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual/Supporting Content */}
          <div className="flex flex-col justify-between h-full gap-4 min-h-0">

            {/* Visual Content / Case Study */}
            <div className="bg-gradient-to-br from-[#00C8FF]/10 to-transparent p-8 rounded-xl border border-[#00C8FF]/20 flex-1 overflow-y-auto min-h-0">
              <h3 className="text-xl font-semibold text-white mb-4 line-clamp-2" title={visualContent.title}>
                {visualContent.title}
              </h3>
              <div className="space-y-3">
                <p className="text-white/70 text-sm leading-relaxed break-words">
                  {visualContent.content}
                </p>
                {visualContent.highlight && (
                  <div className="bg-white/5 p-4 rounded border-l-2 border-[#00C8FF] mt-4">
                    <div className="text-[#00C8FF] font-semibold text-sm mb-2">Result:</div>
                    <div className="text-white/90 text-sm leading-relaxed break-words">{visualContent.highlight}</div>
                  </div>
                )}
              </div>
            </div>

            {/* How It Works */}
            {howItWorks && howItWorks.length > 0 && (
              <div className="bg-white/5 backdrop-blur p-6 rounded-lg border border-white/10 flex-shrink-0 max-h-64 overflow-y-auto">
                <div className="text-[#00C8FF] font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">✦</span>
                  <span>How This Works For You</span>
                </div>
                <div className="space-y-2">
                  {howItWorks.slice(0, 5).map((step, idx) => (
                    <p key={idx} className="text-white/80 text-sm leading-relaxed break-words">
                      • {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA Area - Flexible height */}
      <div className="min-h-[120px] px-12 py-6 flex items-center justify-between border-t border-white/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto w-full">

          {/* CTAs */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-4 flex-wrap">
              {ctas.slice(0, 3).map((cta, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCTAClick(cta)}
                  className={`px-8 py-4 font-semibold rounded-lg transition-all transform hover:scale-105 truncate max-w-xs ${
                    cta.type === 'primary'
                      ? 'bg-[#00C8FF] text-[#0A1930] hover:bg-[#0891B2] shadow-lg'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                  aria-label={cta.text}
                  title={cta.text}
                >
                  {cta.text}
                </button>
              ))}
            </div>

            {/* Alternative action */}
            <div className="text-white/60 text-sm">
              or{' '}
              <button
                onClick={() => onCTAClick && onCTAClick('chat', { source: 'section_footer' })}
                className="text-[#00C8FF] hover:underline font-medium"
              >
                ask a specific question
              </button>
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
