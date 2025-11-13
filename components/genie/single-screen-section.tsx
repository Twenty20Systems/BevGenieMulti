'use client';

import React, { useState } from 'react';
import { Home, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
 * Production-ready Single Screen Section Component
 * Built with shadcn/ui Card, Button, Badge components + Tailwind CSS
 * Professional B2B SaaS layout with no custom CSS
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

  // Extract last word for accent color
  const words = headline.split(' ');
  const lastWord = words[words.length - 1];
  const restOfHeadline = words.slice(0, -1).join(' ');

  return (
    <section className="min-h-screen w-full bg-slate-950 relative flex flex-col snap-start">

      {/* Header - Fixed with Better Hierarchy */}
      <div className="min-h-[120px] px-6 lg:px-12 pt-10 pb-8 flex items-center justify-between border-b border-slate-800 relative z-10 flex-shrink-0 bg-slate-950/95 backdrop-blur-sm">
        <div className="flex-1 max-w-[85%]">
          {/* Headline with cyan accent on last word */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight line-clamp-2 break-words font-display" title={headline}>
            {words.length > 1 ? (
              <>
                {restOfHeadline}{' '}
                <span className="text-cyan-400">{lastWord}</span>
              </>
            ) : (
              headline
            )}
          </h1>
          {/* Punchier subtitle */}
          <p className="text-slate-400 text-base mt-3 line-clamp-2 leading-relaxed" title={subtitle}>
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleScrollToTop}
            className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            onClick={onBackToHome}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            aria-label="Back to home"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline text-sm font-medium">Home</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 lg:px-12 py-12 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 260px)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-0">

          {/* Left Column - Primary Content */}
          <div className="flex flex-col justify-between h-full min-h-0 space-y-8">

            {/* Key Insights */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <h2 className="text-3xl font-bold text-white mb-8 font-display">
                Key Insights
              </h2>
              <div className="space-y-5">
                {insights.slice(0, 4).map((insight, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="text-cyan-400 text-2xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">→</div>
                    <p className="text-slate-300 text-lg leading-relaxed break-words">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats - shadcn/ui Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-shrink-0">
              {stats.slice(0, 3).map((stat, idx) => (
                <Card
                  key={idx}
                  className="group bg-slate-900/50 backdrop-blur-sm border-blue-500/30 hover:border-cyan-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-default"
                >
                  <CardContent className="p-6 space-y-2">
                    <div className="text-4xl font-bold text-cyan-400 truncate group-hover:scale-105 transition-transform" title={stat.value}>
                      {stat.value}
                    </div>
                    <div className="text-base font-semibold text-white line-clamp-2 leading-snug" title={stat.label}>
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed" title={stat.description}>
                        {stat.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Visual/Supporting Content */}
          <div className="flex flex-col justify-between h-full gap-4 min-h-0">

            {/* Visual Content / Case Study - shadcn/ui Card */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-blue-500/40 hover:border-cyan-500/60 transition-colors flex-1 overflow-y-auto min-h-0 shadow-lg shadow-cyan-500/10">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-white line-clamp-2 font-display" title={visualContent.title}>
                  {visualContent.title}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed break-words">
                  {visualContent.content}
                </p>
                {visualContent.highlight && (
                  <Card className="bg-slate-800/50 border-l-4 border-l-cyan-400 shadow-md">
                    <CardContent className="p-5 space-y-2">
                      <Badge className="bg-cyan-500/20 text-cyan-300 text-xs uppercase tracking-wide border-0">
                        Result
                      </Badge>
                      <div className="text-white text-base leading-relaxed break-words font-medium">{visualContent.highlight}</div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            {howItWorks && howItWorks.length > 0 && (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 flex-shrink-0 max-h-64 overflow-y-auto">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <span className="text-xl">✦</span>
                    <span>How This Works For You</span>
                  </div>
                  <div className="space-y-2">
                    {howItWorks.slice(0, 5).map((step, idx) => (
                      <p key={idx} className="text-slate-400 text-sm leading-relaxed break-words">
                        • {step}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA Area */}
      <div className="min-h-[140px] px-6 lg:px-12 py-10 flex items-center justify-between border-t border-slate-800 flex-shrink-0 bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* CTAs */}
            <div className="flex flex-wrap gap-5 items-center">
              {ctas.slice(0, 3).map((cta, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleCTAClick(cta)}
                  variant={cta.type === 'primary' ? 'default' : 'outline'}
                  size="lg"
                  className={
                    cta.type === 'primary'
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-lg shadow-cyan-600/30 hover:shadow-xl hover:shadow-cyan-600/40 transition-all'
                      : 'bg-transparent text-white border-2 border-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-600 font-semibold transition-all'
                  }
                  aria-label={cta.text}
                  title={cta.text}
                >
                  {cta.text}
                </Button>
              ))}
            </div>

            {/* Alternative action */}
            <div className="text-slate-400 text-base flex items-center gap-2">
              <span>or</span>
              <Button
                variant="link"
                onClick={() => onCTAClick && onCTAClick('chat', { source: 'section_footer' })}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold p-0 h-auto"
              >
                ask a specific question
              </Button>
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
